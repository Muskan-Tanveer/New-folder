from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from openai import OpenAI
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct
import os
from dotenv import load_dotenv
import uuid
import json

load_dotenv()

app = FastAPI(title="Explore Pakistan Chatbot API")

# CORS - allow your frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://your-site.vercel.app"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Clients
openai_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
qdrant_client = QdrantClient(
    url=os.getenv("QDRANT_URL"),
    api_key=os.getenv("QDRANT_API_KEY"),
)

COLLECTION_NAME = "pakistan_destinations"

# Pakistan destinations data for RAG
DESTINATIONS_DATA = [
    {
        "id": "hunza-valley",
        "title": "Hunza Valley",
        "content": "Hunza Valley is in Gilgit-Baltistan. Best visited March to October. Highlights: Baltit Fort, Attabad Lake, Rakaposhi View. Reach by flying to Gilgit then drive 2 hours.",
    },
    {
        "id": "lahore",
        "title": "Lahore",
        "content": "Lahore is the cultural capital. Best October to March. Famous for Badshahi Mosque, Lahore Fort, Shalimar Gardens, and Food Street. Well connected by motorway and flights.",
    },
    {
        "id": "swat-valley",
        "title": "Swat Valley",
        "content": "Called Switzerland of Pakistan. Lush green meadows and rivers. Best April to October. Drive 4-5 hours from Islamabad. Visit Malam Jabba, Kalam, Fizagat Park.",
    },
    {
        "id": "karachi",
        "title": "Karachi",
        "content": "Pakistan's largest city with beautiful beaches. Best November to February. Famous for Clifton Beach, Mohatta Palace, Burns Road Food. Major international airport.",
    },
    {
        "id": "skardu",
        "title": "Skardu",
        "content": "Gateway to K2. Best May to September. Amazing Shangrila Resort, Deosai Plains, Kachura Lakes. Fly from Islamabad to Skardu Airport.",
    },
    {
        "id": "islamabad",
        "title": "Islamabad",
        "content": "Pakistan's green capital. Good year-round, best spring and autumn. Famous for Faisal Mosque, Margalla Hills, Daman-e-Koh. Has major international airport NIIA.",
    },
]


class ChatRequest(BaseModel):
    message: str
    session_id: str = ""


class ChatResponse(BaseModel):
    response: str
    session_id: str


def setup_qdrant():
    """Create collection and upload destinations if not exists"""
    try:
        qdrant_client.get_collection(COLLECTION_NAME)
    except Exception:
        # Create collection
        qdrant_client.create_collection(
            collection_name=COLLECTION_NAME,
            vectors_config=VectorParams(size=1536, distance=Distance.COSINE),
        )
        # Upload destinations
        points = []
        for i, dest in enumerate(DESTINATIONS_DATA):
            embedding = openai_client.embeddings.create(
                model="text-embedding-ada-002", input=dest["content"]
            ).data[0].embedding

            points.append(
                PointStruct(
                    id=i,
                    vector=embedding,
                    payload={"title": dest["title"], "content": dest["content"]},
                )
            )
        qdrant_client.upsert(collection_name=COLLECTION_NAME, points=points)
        print("Qdrant collection created and populated!")


@app.on_event("startup")
async def startup():
    setup_qdrant()


@app.get("/")
def root():
    return {"message": "Explore Pakistan Chatbot API is running!"}


@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    try:
        # Step 1: Embed the user query
        query_embedding = openai_client.embeddings.create(
            model="text-embedding-ada-002", input=request.message
        ).data[0].embedding

        # Step 2: Search Qdrant for relevant content
        search_results = qdrant_client.search(
            collection_name=COLLECTION_NAME,
            query_vector=query_embedding,
            limit=3,
        )

        # Build context from search results
        context = "\n\n".join(
            [f"{r.payload['title']}: {r.payload['content']}" for r in search_results]
        )

        # Step 3: Generate response with OpenAI
        system_prompt = f"""You are a helpful travel guide for Pakistan.
Use this information to answer questions:

{context}

Be friendly, informative, and encourage travel to Pakistan.
Keep responses concise (2-3 sentences max). If asked about something not in
the context, mention you specialize in Pakistani travel destinations."""

        response = openai_client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": request.message},
            ],
            max_tokens=200,
        )

        ai_response = response.choices[0].message.content
        session_id = request.session_id or str(uuid.uuid4())

        return ChatResponse(response=ai_response, session_id=session_id)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))