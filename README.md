# 🧠 RAG Chatbot Frontend (React + Vite + MUI)

Este es el frontend del proyecto de Chatbot con generación aumentada por recuperación (RAG), desarrollado con React + Vite + TypeScript + Material UI.

---

## ✅ Requisitos

- [Node.js](https://nodejs.org/en) — gestionado con `nvm`
- [npm](https://www.npmjs.com/) versión 8 o superior
- [`nvm-windows`](https://github.com/coreybutler/nvm-windows) — administrador de versiones de Node.js

---

## ⚙️ Instalación de `nvm-windows`

1. Descarga el instalador desde:  
   👉 https://github.com/coreybutler/nvm-windows/releases

2. Instálalo con las opciones por defecto.

3. Abre una nueva terminal y ejecuta:

```bash
nvm install
nvm use
```

> Esto usará automáticamente la versión definida en el archivo `.nvmrc` (`18.20.8`)

---

## 🚀 Instalación del frontend

### 1. Accede a la carpeta

```bash
cd frontend
```

### 2. Instala dependencias (versión exacta)

```bash
npm ci
```

> 🟢 `npm ci` cumple exactamente la misma función:  
> instalar las dependencias **exactamente como están en `package-lock.json`**, sin actualizarlas ni resolver versiones nuevamente.

Esto garantiza que todas las personas desarrollen con el mismo entorno.

---

### 3. Ejecuta en modo desarrollo

```bash
npm run dev
```

Y abre tu navegador en:

```
http://localhost:5173
```

---

## 🔗 Conexión con el backend

Asegúrate de que el backend RAG (FastAPI, Flask o Gradio) esté corriendo en:

```
http://localhost:8000/ask
```

Y acepte solicitudes POST con el siguiente cuerpo:

```json
{ "question": "..." }
```

---

## 📁 Estructura del proyecto

```
NLP-ChatBot-TA/
├── frontend/
│   ├── .nvmrc               ← Versión de Node (18.20.8)
│   ├── package-lock.json    ← Define versiones exactas de dependencias
│   ├── package.json         ← Scripts y dependencias
│   └── ...
├── ChatBot_TA.ipynb         ← Backend RAG en notebook (opcional)
└── README.md
```

---

## 🛡 Buenas prácticas

- ✅ Usa `npm co` (alias de `npm ci`) para mantener consistencia en las versiones
- ✅ Ejecuta `nvm use` en cada entorno antes de instalar
- ✅ Versiona siempre `package-lock.json`
- ❌ No uses `npm install` ni actualices dependencias sin coordinación

---

¿Preguntas o aportes? ¡Este proyecto está vivo y mejora con tu participación! 🚀
