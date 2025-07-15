import os
import re
import requests
import logging
from bs4 import BeautifulSoup

from langchain_huggingface import HuggingFaceEmbeddings
from langchain_chroma import Chroma
from langchain.chains import RetrievalQA
from langchain_ollama import OllamaLLM
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.prompts import PromptTemplate

# Configurar logging
logging.basicConfig(
    level=logging.INFO,
    format="%(levelname)s: %(message)s"
)

# Directorio donde Chroma persistirá los datos (texto y embeddings)
PERSIST_DIR = "backend/db/"

URLS = [
    "https://es.wikipedia.org/wiki/Batalla_de_Ayacucho",
    "https://en.wikipedia.org/wiki/Battle_of_Ayacucho",
    "https://www.encyclopedia.com/humanities/encyclopedias-almanacs-transcripts-and-maps/ayacucho-battle",
    "https://www.britannica.com/topic/Battle-of-Ayacucho",
    "https://www.britannica.com/place/Ayacucho-Peru",
    "https://www.tierrasvivas.com/en/ayacucho-battle",
    "https://es.wikipedia.org/wiki/Capitulaci%C3%B3n_de_Ayacucho",
    "https://es.wikipedia.org/wiki/Santuario_hist%C3%B3rico_de_la_Pampa_de_Ayacucho",
    "https://elpais.com/america/2024-12-09/ayacucho-diciembre-9-1824-el-final-de-un-imperio-y-el-inicio-de-america-latina.html"
]

PROMPT = PromptTemplate(
    input_variables=["context", "question"],
    template="""
Eres un historiador experto que responde exclusivamente en español. Responde de manera clara y precisa usando solo la información contenida en el contexto.

Contexto:
{context}

Pregunta:
{question}

Respuesta:"""
)

qa_chain = None
retriever = None
llm = None

def extraer_texto(url: str) -> str:
    """
    Descarga y limpia el texto de una URL.
    """
    try:
        resp = requests.get(url, headers={"User-Agent": "Mozilla/5.0"}, timeout=10)
        resp.raise_for_status()
    except requests.RequestException:
        logging.warning(f"No se pudo descargar la URL: {url}")
        return ""
    soup = BeautifulSoup(resp.text, "html.parser")
    for tag in soup(["script", "style", "sup", "img", "figure", "table", "noscript"]):
        tag.decompose()
    texto = soup.get_text(separator=" ")
    return re.sub(r"\s+", " ", texto).strip()


def inicializar_index() -> None:
    """
    Inicializa la base de datos y la cadena de QA.
    """
    global qa_chain, retriever, llm

    os.makedirs(PERSIST_DIR, exist_ok=True)
    embedding_fn = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
    vect_store = Chroma(persist_directory=PERSIST_DIR, embedding_function=embedding_fn)

    if vect_store._collection.count() == 0:
        logging.info("La base de datos está vacía. Iniciando ingestión.")
        documentos = [(u, extraer_texto(u)) for u in URLS]
        splitter = RecursiveCharacterTextSplitter(
            chunk_size=400, chunk_overlap=50,
            separators=["\n\n", "\n", ".", "!", "?", " ", ""]
        )
        chunks, metadatas = [], []
        for url, doc in documentos:
            if doc:
                logging.info("Procesando URL: %s", url)
                fragmentos = splitter.split_text(doc)
                chunks.extend(fragmentos)
                metadatas.extend([{"source": url}] * len(fragmentos))
        vect_store.add_texts(texts=chunks, metadatas=metadatas)
        logging.info("Ingestión completada. %d fragmentos añadidos.", len(chunks))
    else:
        logging.info("Base de datos ya cargada. Se omite la ingestión.")

    retriever = vect_store.as_retriever()
    llm = OllamaLLM(model="phi3.5:latest", temperature=0.5)

    qa_chain = RetrievalQA.from_chain_type(
        llm=llm,
        chain_type="stuff",
        retriever=retriever,
        chain_type_kwargs={"prompt": PROMPT}
    )


def responder_pregunta(pregunta: str) -> str:
    """
    Procesa la pregunta usando recuperación y LLM, loggeando todo el flujo.
    """
    logging.info("🧠 Pregunta recibida: '%s'", pregunta)

    if not pregunta.strip():
        logging.warning("⚠️ Pregunta vacía.")
        return "⚠️ La pregunta no puede estar vacía."
    if qa_chain is None or retriever is None or llm is None:
        logging.error("❌ Sistema no inicializado.")
        return "⚠️ El índice no está inicializado. Reinicia el servidor e inténtalo de nuevo."

    try:
        # Recuperar documentos
        documentos = retriever.invoke(pregunta)
        contexto = "\n\n".join([d.page_content for d in documentos[:3]])

        # Renderizar prompt manualmente
        prompt_renderizado = PROMPT.format(context=contexto, question=pregunta)
        logging.info("\033[33m📄 Prompt enviado al modelo:\n%s\033[0m", prompt_renderizado)

        # Enviar al LLM
        respuesta = llm.invoke(prompt_renderizado)
        logging.info("✅ Respuesta generada:\n%s", respuesta.strip())

        return respuesta.strip()

    except Exception as e:
        logging.exception("🔥 Error al procesar la pregunta:")
        return f"⚠️ Ocurrió un error al procesar la pregunta: {e}"
