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

# Load system environment keys
load_dotenv()

app = FastAPI(title="Explore Pakistan Chatbot API")

# Configure Cross-Origin Resource Sharing (CORS)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://your-site.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Google Gemini 
GEMINI_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_KEY:
    print("⚠️ WARNING: GEMINI_API_KEY is not defined in your environment or .env file!")
genai.configure(api_key=GEMINI_KEY)
gemini_model = genai.GenerativeModel("gemini-2.5-flash")

# Initialize Qdrant Client Remote Cloud Connection
qdrant_client = QdrantClient(
    url=os.getenv("QDRANT_URL"),
    api_key=os.getenv("QDRANT_API_KEY"),
)

COLLECTION_NAME = "pakistan_destinations"

# Base Data Seed Configuration
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

# Validation Schemas
class ChatRequest(BaseModel):
    message: str
    session_id: str = ""

class ChatResponse(BaseModel):
    response: str
    session_id: str


def setup_qdrant():
    """Initializes collections and handles vector setup safely."""
    try:
        # Check if the database collection already exists on the cloud cluster
        if not qdrant_client.collection_exists(collection_name=COLLECTION_NAME):
            print(f"Collection '{COLLECTION_NAME}' does not exist. Creating it...")
            
            qdrant_client.create_collection(
                collection_name=COLLECTION_NAME,
                vectors_config=VectorParams(size=1536, distance=Distance.COSINE),
            )

            # Generate default payload points
            points = []
            for i, dest in enumerate(DESTINATIONS_DATA):
                points.append(
                    PointStruct(
                        id=i,
                        vector=[0.0] * 1536,  # Placeholder dimension matching size=1536
                        payload=dest,
                    )
                )

            qdrant_client.upsert(collection_name=COLLECTION_NAME, points=points)
            print(f"Successfully initialized collection '{COLLECTION_NAME}' with {len(points)} points.")
        else:
            print(f"Collection '{COLLECTION_NAME}' already exists. Skipping database seeding.")

    except UnexpectedResponse as ur_err:
        print(f"❌ Qdrant API Error during cluster setup: {ur_err}")
    except Exception as e:
        print(f"❌ System connection error during database initialization: {e}")


@app.on_event("startup")
async def startup():
    setup_qdrant()


@app.post("/chat", response_model=ChatResponse)
def chat(request: ChatRequest):
    """
    Handles user chat interactions. 
    Switched to synchronous execution style so FastAPI safely processes 
    blocking SDK network requests using an internal external worker thread.
    """
    try:
        context_items = []
        
        # Pull records from Qdrant Cloud Storage
        try:
            scroll_response = qdrant_client.scroll(collection_name=COLLECTION_NAME, limit=3)
            search_results = scroll_response[0] if scroll_response else []
            
            # Extract values dynamically with robust fallback protection
            for record in search_results:
                if record.payload:
                    title = record.payload.get("title", "Destination Information")
                    content = record.payload.get("content", "").strip()
                    if content:
                        context_items.append(f"{title}: {content}")
        except Exception as qd_err:
            print(f"⚠️ Non-breaking alert: Failed parsing database records: {qd_err}")
        
        # Fallback if context yields zero entries
        context = "\n".join(context_items) if context_items else "No reference context data available."

        # Compile strict system boundaries matching user expectations
        prompt = f"""
You are an expert Pakistan travel guide AI.

Context:
{context}

User question:
{request.message}

Give a short helpful answer (2-3 lines max).
"""

        # Dispatch execution payload to Gemini Large Language Model
        response = gemini_model.generate_content(prompt)
        
        # Read or assign dynamic transaction session details 
        generated_session_id = request.session_id if request.session_id.strip() else str(uuid.uuid4())

        return ChatResponse(
            response=response.text if response.text else "I am unable to generate a travel response at this moment.",
            session_id=generated_session_id
        )

    except Exception as e:
        # Trace the absolute lineage of the exception directly inside your terminal window
        print("\n===💥 EXCEPTION ENCOUNTERED INSIDE /CHAT ENDPOINT 💥===")
        traceback.print_exc()
        print("========================================================\n")
        raise HTTPException(status_code=500, detail=f"Internal Server Exception: {str(e)}")


@app.get("/")
def root():
    return {"message": "Gemini + Qdrant Chatbot Running smoothly."}