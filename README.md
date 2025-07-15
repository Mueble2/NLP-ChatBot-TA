# 🧠 ChatBot RAG - Ayacucho

Este proyecto es un chatbot basado en Retrieval-Augmented Generation (RAG), que permite responder preguntas sobre la Batalla de Ayacucho a partir de fuentes históricas disponibles en línea.

---

## ⚙️ Requisitos

- Python 3.10 o superior
- Node.js 18+ y npm
- Navegador web moderno
- [Ollama](https://ollama.com/) instalado localmente

---

## 🔌 Instalación de Ollama y modelo LLM

**Ollama** es el servidor que ejecuta localmente el modelo de lenguaje `phi3.5`, utilizado por el backend.

### En Linux/macOS:

1. Instala Ollama:

   ```bash
   curl -fsSL https://ollama.com/install.sh | sh

   ```

2. Lanza el servidor Ollama (en segundo plano):

   ```bash
   ollama serve > /dev/null 2>&1 &
   sleep 10
   ```

3. Descarga el modelo `phi3.5`:

   ```bash
   ollama pull phi3.5:latest
   ```

> ⚠️ Si estás en **Windows**, descarga Ollama desde su [sitio oficial](https://ollama.com/download) y asegúrate de que esté ejecutándose antes de iniciar el backend.

---

## 🖥️ Instalación del proyecto

### 🔧 Backend

1. Abre una terminal y navega a la carpeta del backend:

   ```bash
   cd backend
   ```

2. Crea un entorno virtual:

   ```bash
   python -m venv venv
   source venv/bin/activate  # En Linux/Mac
   venv\Scripts\activate     # En Windows
   ```

3. Instala las dependencias:

   ```bash
   pip install -r requirements.txt
   ```

### 💻 Frontend

1. Abre otra terminal y navega a la carpeta del frontend:

   ```bash
   cd frontend
   ```

2. Instala las dependencias:

   ```bash
   npm install
   ```

---

## 🚀 Ejecución

### Backend

Desde la carpeta raíz del proyecto:

```bash
uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend

En otra terminal:

```bash
cd frontend
npm run dev
```

---

## ✅ ¡Listo!

El chatbot estará disponible en:

📍 [http://localhost:5173/](http://localhost:5173/)

---

## 📝 Notas adicionales

- Verifica que el servidor de Ollama esté corriendo antes de levantar el backend.
- La base de datos vectorial (Chroma) se almacena en `backend/db/`.
- El modelo `phi3.5` se utiliza por defecto con temperatura 0.5 para mantener respuestas coherentes y controladas.

```

¿Deseas que te lo empaquete como archivo descargable `.md`?
```
