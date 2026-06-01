from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct
import os
from dotenv import load_dotenv
import uuid
import google.generativeai as genai

load_dotenv()

app = FastAPI(title="Explore Pakistan Chatbot API")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://your-site.vercel.app"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Gemini setup
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

gemini_model = genai.GenerativeModel("gemini-1.5-flash")

# Qdrant
qdrant_client = QdrantClient(
    url=os.getenv("QDRANT_URL"),
    api_key=os.getenv("QDRANT_API_KEY"),
)

COLLECTION_NAME = "pakistan_destinations"

# Data
DESTINATIONS_DATA = [
    {"id": "hunza-valley", "title": "Hunza Valley",
     "content": "Hunza Valley is in Gilgit-Baltistan. Best visited March to October. Baltit Fort, Attabad Lake."},
    {"id": "lahore", "title": "Lahore",
     "content": "Lahore is cultural capital. Badshahi Mosque, Lahore Fort, Food Street."},
]

class ChatRequest(BaseModel):
    message: str
    session_id: str = ""

class ChatResponse(BaseModel):
    response: str
    session_id: str


# setup Qdrant
def setup_qdrant():
    try:
        qdrant_client.get_collection(COLLECTION_NAME)
    except:
        qdrant_client.create_collection(
            collection_name=COLLECTION_NAME,
            vectors_config=VectorParams(size=1536, distance=Distance.COSINE),
        )

        # NOTE: embeddings still need model → using simple placeholder logic
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


@app.on_event("startup")
async def startup():
    setup_qdrant()


@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    try:
        # Step 1: search Qdrant (basic)
        search_results = qdrant_client.scroll(
            collection_name=COLLECTION_NAME,
            limit=3
        )[0]

        context = "\n".join(
            [f"{r.payload['title']}: {r.payload['content']}" for r in search_results]
        )

        # Step 2: Gemini response
        prompt = f"""
You are a Pakistan travel guide.

Context:
{context}

User question:
{request.message}

Give a short helpful answer (2-3 lines).
"""

        response = gemini_model.generate_content(prompt)

        session_id = request.session_id or str(uuid.uuid4())

        return ChatResponse(
            response=response.text,
            session_id=session_id
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/")
def root():
    return {"message": "Gemini + Qdrant Chatbot Running"}