from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct
from qdrant_client.http.exceptions import UnexpectedResponse
import os
from dotenv import load_dotenv
import uuid
import google.generativeai as genai
import traceback

load_dotenv()

app = FastAPI(title="Explore Pakistan Chatbot API")

# Setup CORS - Allow your Vercel frontend domain to access the API safely
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins during staging setup; restrict to your production frontend domain later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Active Gemini Setup using the updated stable flash structure
GEMINI_KEY = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=GEMINI_KEY)
gemini_model = genai.GenerativeModel("gemini-2.5-flash")

# Qdrant Client Setup
qdrant_client = QdrantClient(
    url=os.getenv("QDRANT_URL"),
    api_key=os.getenv("QDRANT_API_KEY"),
)

COLLECTION_NAME = "pakistan_destinations"

DESTINATIONS_DATA = [
    {
        "id": "hunza-valley", 
        "title": "Hunza Valley",
        "content": "Hunza Valley is in Gilgit-Baltistan. Best visited March to October. Baltit Fort, Attabad Lake."
    },
    {
        "id": "lahore", 
        "title": "Lahore",
        "content": "Lahore is the cultural capital of Pakistan. Famous for Badshahi Mosque, Lahore Fort, and Food Street."
    },
]

class ChatRequest(BaseModel):
    message: str
    session_id: str = ""

class ChatResponse(BaseModel):
    response: str
    session_id: str


def setup_qdrant():
    try:
        if not qdrant_client.collection_exists(collection_name=COLLECTION_NAME):
            print(f"Collection '{COLLECTION_NAME}' does not exist. Creating it...")
            qdrant_client.create_collection(
                collection_name=COLLECTION_NAME,
                vectors_config=VectorParams(size=1536, distance=Distance.COSINE),
            )
            points = []
            for i, dest in enumerate(DESTINATIONS_DATA):
                points.append(
                    PointStruct(
                        id=i,
                        vector=[0.0] * 1536,
                        payload=dest,
                    )
                )
            qdrant_client.upsert(collection_name=COLLECTION_NAME, points=points)
            print("Successfully initialized Qdrant Collection.")
    except Exception as e:
        print(f"Database Initialization skipped/failed: {e}")


@app.on_event("startup")
async def startup():
    setup_qdrant()


@app.post("/chat", response_model=ChatResponse)
def chat(request: ChatRequest):
    try:
        context_items = []
        try:
            scroll_response = qdrant_client.scroll(collection_name=COLLECTION_NAME, limit=3)
            search_results = scroll_response[0] if scroll_response else []
            for record in search_results:
                if record.payload:
                    title = record.payload.get("title", "Destination Info")
                    content = record.payload.get("content", "").strip()
                    if content:
                        context_items.append(f"{title}: {content}")
        except Exception as qd_err:
            print(f"Qdrant Context warning: {qd_err}")
        
        context = "\n".join(context_items) if context_items else "No reference context data available."

        prompt = f"""
You are an expert Pakistan travel guide AI.

Context:
{context}

User question:
{request.message}

Give a short helpful answer (2-3 lines max).
"""
        response = gemini_model.generate_content(prompt)
        generated_session_id = request.session_id if request.session_id.strip() else str(uuid.uuid4())

        return ChatResponse(
            response=response.text if response.text else "I am unable to formulate a response.",
            session_id=generated_session_id
        )

    except Exception as e:
        print("\n===💥 RUNTIME ERROR INSIDE /CHAT ENDPOINT 💥===")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/")
def root():
    return {"status": "online", "engine": "Gemini 2.5 Flash + Qdrant Cloud"}