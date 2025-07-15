from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from backend.chatbot import inicializar_index, responder_pregunta
from contextlib import asynccontextmanager

import logging

# Configurar logging
logging.basicConfig(
    level=logging.INFO,
    format="%(levelname)s: %(message)s",
)


class ChatRequest(BaseModel):
    pregunta: str

class ChatResponse(BaseModel):
    respuesta: str

@asynccontextmanager
async def lifespan(app: FastAPI):
    logging.info("🚀 Iniciando aplicación FastAPI...")
    inicializar_index()
    logging.info("✅ Sistema listo para recibir solicitudes.")
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
    logging.info("📩 Solicitud recibida en /chat")
    respuesta = responder_pregunta(req.pregunta)
    logging.info("📤 Enviando respuesta.")
    return ChatResponse(respuesta=respuesta)