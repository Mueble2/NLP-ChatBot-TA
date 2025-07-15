# 🧠 ChatBot RAG - Ayacucho

Este proyecto es un chatbot basado en Retrieval-Augmented Generation (RAG), que permite responder preguntas sobre la Batalla de Ayacucho a partir de fuentes en línea.

---

## ⚙️ Requisitos

- Python 3.10 o superior
- Node.js 18+ y npm
- Navegador web moderno

---

## 🖥️ Instalación

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

Accede al chatbot desde tu navegador en:

📍 [http://localhost:5173/](http://localhost:5173/)

---

## 📝 Notas

- Asegúrate de que el backend esté completamente inicializado antes de hacer consultas desde el frontend.
- Los datos se almacenan en `backend/db/` usando `Chroma` como base vectorial persistente.
