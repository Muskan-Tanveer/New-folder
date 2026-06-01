from __future__ import annotations

from contextlib import asynccontextmanager
from pathlib import Path
from typing import Optional

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

# Always load Backend/.env when running locally (Railway injects env vars directly)
load_dotenv(Path(__file__).resolve().parent / ".env")

GEMINI_KEY = os.getenv("GEMINI_API_KEY", "").strip()
QDRANT_URL = os.getenv("QDRANT_URL", "").strip()
QDRANT_API_KEY = os.getenv("QDRANT_API_KEY", "").strip()
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.0-flash").strip()

COLLECTION_NAME = "pakistan_destinations"
VECTOR_SIZE = 1536

# Keep in sync with library/destinations.ts (used for RAG context in Qdrant)
DESTINATIONS_DATA = [
    {
        "id": "hunza-valley",
        "title": "Hunza Valley",
        "content": "Hunza Valley, Gilgit-Baltistan. Best March–October. Highlights: Baltit Fort, Attabad Lake, Rakaposhi views.",
    },
    {
        "id": "lahore",
        "title": "Lahore",
        "content": "Cultural capital of Pakistan. Best October–March. Highlights: Badshahi Mosque, Lahore Fort, Shalimar Gardens, Food Street.",
    },
    {
        "id": "swat-valley",
        "title": "Swat Valley",
        "content": "Swat Valley, Khyber Pakhtunkhwa — 'Switzerland of Pakistan'. Best April–October. Highlights: Malam Jabba, Kalam, Fizagat Park.",
    },
    {
        "id": "karachi",
        "title": "Karachi",
        "content": "Pakistan's largest city and economic hub. Best November–February. Highlights: Clifton Beach, Mohatta Palace, Burns Road food.",
    },
    {
        "id": "skardu",
        "title": "Skardu",
        "content": "Gateway to K2 in Gilgit-Baltistan. Best May–September. Highlights: Shangrila Resort, Deosai Plains, Kachura Lakes.",
    },
    {
        "id": "islamabad",
        "title": "Islamabad",
        "content": "Pakistan's capital. Year-round; spring and autumn are ideal. Highlights: Faisal Mosque, Margalla Hills, Daman-e-Koh.",
    },
]

qdrant_client: Optional[QdrantClient] = None
gemini_model = None


def _cors_origins() -> list[str]:
    origins = ["http://localhost:3000"]
    extra = os.getenv("CORS_ORIGINS", "").strip()
    if extra:
        origins.extend(o.strip().rstrip("/") for o in extra.split(",") if o.strip())
    frontend = os.getenv("FRONTEND_URL", "").strip().rstrip("/")
    if frontend and frontend not in origins:
        origins.append(frontend)
    return origins


def _require_config() -> dict[str, bool]:
    return {
        "gemini": bool(GEMINI_KEY),
        "qdrant_url": bool(QDRANT_URL),
        "qdrant_key": bool(QDRANT_API_KEY),
    }


def _init_clients() -> None:
    global qdrant_client, gemini_model

    if not GEMINI_KEY:
        print("⚠️ GEMINI_API_KEY is missing — /chat will fail until it is set.")
    else:
        genai.configure(api_key=GEMINI_KEY)
        gemini_model = genai.GenerativeModel(GEMINI_MODEL)

    if QDRANT_URL and QDRANT_API_KEY:
        qdrant_client = QdrantClient(url=QDRANT_URL, api_key=QDRANT_API_KEY)
    else:
        print("⚠️ QDRANT_URL or QDRANT_API_KEY missing — RAG context will be empty.")


def setup_qdrant() -> None:
    if qdrant_client is None:
        return

    try:
        if not qdrant_client.collection_exists(collection_name=COLLECTION_NAME):
            print(f"Creating collection '{COLLECTION_NAME}'...")
            qdrant_client.create_collection(
                collection_name=COLLECTION_NAME,
                vectors_config=VectorParams(size=VECTOR_SIZE, distance=Distance.COSINE),
            )

        points = [
            PointStruct(
                id=i,
                vector=[0.0] * VECTOR_SIZE,
                payload=dest,
            )
            for i, dest in enumerate(DESTINATIONS_DATA)
        ]
        qdrant_client.upsert(collection_name=COLLECTION_NAME, points=points)
        print(f"Synced {len(points)} destination(s) to Qdrant.")

    except UnexpectedResponse as ur_err:
        print(f"❌ Qdrant API error: {ur_err}")
    except Exception as e:
        print(f"❌ Qdrant setup error: {e}")


@asynccontextmanager
async def lifespan(app: FastAPI):
    _init_clients()
    setup_qdrant()
    yield


app = FastAPI(title="Explore Pakistan Chatbot API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=_cors_origins(),
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatRequest(BaseModel):
    message: str
    session_id: str = ""


class ChatResponse(BaseModel):
    response: str
    session_id: str


@app.get("/")
def root():
    return {"message": "Gemini + Qdrant Chatbot Running smoothly."}


@app.get("/health")
def health():
    cfg = _require_config()
    ok = cfg["gemini"] and cfg["qdrant_url"] and cfg["qdrant_key"]
    return {
        "status": "ok" if ok else "degraded",
        "config": cfg,
        "gemini_model": GEMINI_MODEL,
    }


@app.post("/chat", response_model=ChatResponse)
def chat(request: ChatRequest):
    if not GEMINI_KEY or gemini_model is None:
        raise HTTPException(
            status_code=503,
            detail="GEMINI_API_KEY is not configured on the server.",
        )

    try:
        context_items: list[str] = []

        if qdrant_client is not None:
            try:
                scroll_response = qdrant_client.scroll(
                    collection_name=COLLECTION_NAME, limit=len(DESTINATIONS_DATA)
                )
                search_results = scroll_response[0] if scroll_response else []

                for record in search_results:
                    if record.payload:
                        title = record.payload.get("title", "Destination")
                        content = record.payload.get("content", "").strip()
                        if content:
                            context_items.append(f"{title}: {content}")
            except Exception as qd_err:
                print(f"⚠️ Qdrant read failed: {qd_err}")

        context = (
            "\n".join(context_items)
            if context_items
            else "No reference context data available."
        )

        prompt = f"""You are an expert Pakistan travel guide AI.

Context:
{context}

User question:
{request.message}

Give a short helpful answer (2-3 lines max).
"""

        response = gemini_model.generate_content(prompt)
        session_id = (
            request.session_id.strip()
            if request.session_id.strip()
            else str(uuid.uuid4())
        )

        return ChatResponse(
            response=response.text
            or "I am unable to generate a travel response at this moment.",
            session_id=session_id,
        )

    except Exception as e:
        print("\n=== /chat exception ===")
        traceback.print_exc()
        print("========================\n")
        raise HTTPException(status_code=500, detail=f"Chat failed: {str(e)}")
