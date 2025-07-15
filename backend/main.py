from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from backend.chatbot import inicializar_index, responder_pregunta
from contextlib import asynccontextmanager

class ChatRequest(BaseModel):
    pregunta: str

class ChatResponse(BaseModel):
    respuesta: str

@asynccontextmanager
async def lifespan(app: FastAPI):
    inicializar_index()
    yield

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/chat", response_model=ChatResponse)
async def chat(req: ChatRequest):
    return ChatResponse(respuesta=responder_pregunta(req.pregunta))
