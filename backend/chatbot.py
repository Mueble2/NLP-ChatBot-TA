import os
import re
import requests
from bs4 import BeautifulSoup

from langchain_huggingface import HuggingFaceEmbeddings
from langchain_chroma import Chroma
from langchain.chains import RetrievalQA
from langchain_ollama import OllamaLLM
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.prompts import PromptTemplate

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


def extraer_texto(url: str) -> str:
    """
    Descarga y limpia el texto de una URL.
    """
    try:
        resp = requests.get(url, headers={"User-Agent": "Mozilla/5.0"}, timeout=10)
        resp.raise_for_status()
    except requests.RequestException:
        return ""
    soup = BeautifulSoup(resp.text, "html.parser")
    for tag in soup(["script", "style", "sup", "img", "figure", "table", "noscript"]):
        tag.decompose()
    texto = soup.get_text(separator=" ")
    return re.sub(r"\s+", " ", texto).strip()


def inicializar_index() -> None:
    """
    Se encarga de:
      1. Crear el directorio de persistencia.
      2. Iniciar o recuperar la base de datos Chroma.
      3. Si está vacía, extraer documentos, dividirlos, embedder y guardar.
      4. Construir la cadena RetrievalQA.
    Debe llamarse en el evento 'startup' de FastAPI.
    """
    global qa_chain

    # 1. Asegura que exista el directorio de persistencia
    os.makedirs(PERSIST_DIR, exist_ok=True)

    # 2. Modelo de embeddings
    embedding_fn = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

    # 3. VectorStore Chroma (auto-persistente)
    vect_store = Chroma(
        persist_directory=PERSIST_DIR,
        embedding_function=embedding_fn
    )

    # 4. Ingestión solo si la base de datos está vacía
    if vect_store._collection.count() == 0:
        documentos = [(u, extraer_texto(u)) for u in URLS]
        splitter = RecursiveCharacterTextSplitter(
            chunk_size=400,
            chunk_overlap=50,
            separators=["\n\n", "\n", ".", "!", "?", " ", ""]
        )
        chunks, metadatas = [], []
        for url, doc in documentos:
            if doc:
                fragmentos = splitter.split_text(doc)
                chunks.extend(fragmentos)
                metadatas.extend([{"source": url}] * len(fragmentos))
        vect_store.add_texts(texts=chunks, metadatas=metadatas)

    # 5. Modelo LLM
    llm = OllamaLLM(model="phi3.5:latest", temperature=0.5)

    # 6. Cadena RAG con RetrievalQA
    qa_chain = RetrievalQA.from_chain_type(
        llm=llm,
        chain_type="stuff",
        retriever=vect_store.as_retriever(),
        chain_type_kwargs={"prompt": PROMPT}
    )


def responder_pregunta(pregunta: str) -> str:
    """
    Llama a la cadena de QA con una pregunta y retorna la respuesta generada.
    """
    if not pregunta.strip():
        return "⚠️ La pregunta no puede estar vacía."
    if qa_chain is None:
        return "⚠️ El índice no está inicializado. Reinicia el servidor e inténtalo de nuevo."
    try:
        resultado = qa_chain.invoke({"query": pregunta})
        if isinstance(resultado, dict) and "result" in resultado:
            return resultado["result"]
        elif isinstance(resultado, str):
            return resultado
        else:
            return "⚠️ No se pudo obtener una respuesta válida."
    except Exception as e:
        return f"⚠️ Ocurrió un error al procesar la pregunta: {e}"
