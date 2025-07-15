import { useEffect, useRef, useState } from "react";
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Paper,
  IconButton,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AndroidIcon from "@mui/icons-material/Android";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";

import type { ChatEntry } from "./types";

interface Props {
  onToggleTheme: () => void;
  themeMode: "light" | "dark";
}

function App({ onToggleTheme, themeMode }: Props) {
  const [question, setQuestion] = useState("");
  const [chat, setChat] = useState<ChatEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  // Mensaje inicial del veterano
  useEffect(() => {
    const mensajeBienvenida: ChatEntry = {
      question: "",
      answer:
        "¡Hola! Soy el Sargento Tomás Rivas, un veterano de la histórica Batalla de Ayacucho. Estoy aquí para contarte lo que ocurrió, aclarar dudas sobre los héroes de nuestra independencia y compartir historias de aquel día. ¡Solo pregúntame!",
    };
    setChat([mensajeBienvenida]);
  }, []);

  // Scroll automático hacia abajo
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const handleAsk = async () => {
    if (!question.trim()) return;

    const nuevaPregunta = question;
    setQuestion("");

    setChat((prev) => [...prev, { question: nuevaPregunta, answer: "..." }]);
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pregunta: nuevaPregunta }),
      });

      const data = await response.json();

      setChat((prev) => {
        const actualizado = [...prev];
        actualizado[actualizado.length - 1] = {
          question: nuevaPregunta,
          answer: data.respuesta,
        };
        return actualizado;
      });
    } catch (error) {
      setChat((prev) => {
        const actualizado = [...prev];
        actualizado[actualizado.length - 1] = {
          question: nuevaPregunta,
          answer: "❌ Error al obtener respuesta: " + error,
        };
        return actualizado;
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        color: "text.primary",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        px: 2,
      }}
    >
      {/* Botón de cambio de tema */}
      <Box position="absolute" top={8} right={8}>
        <IconButton onClick={onToggleTheme} color="inherit">
          {themeMode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
      </Box>

      <Container maxWidth="xs">
        <Typography variant="h5" align="center" gutterBottom>
          Habla con el Sgto. Tomás Rivas
        </Typography>

        <Paper
          sx={{
            height: "60vh",
            overflowY: "auto",
            p: 1,
            mb: 2,
            borderRadius: 2,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            bgcolor: "background.paper",
            "&::-webkit-scrollbar": {
              width: "8px",
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: "#2a2a2a",
              borderRadius: "4px",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#555",
              borderRadius: "4px",
            },
            "&::-webkit-scrollbar-thumb:hover": {
              backgroundColor: "#888",
            },
          }}
        >
          {chat.map((entry, i) => (
            <Box key={i}>
              {entry.question && (
                <Box display="flex" alignItems="center" gap={1}>
                  <AccountCircleIcon color="primary" />
                  <Typography variant="body2">{entry.question}</Typography>
                </Box>
              )}
              <Box display="flex" alignItems="center" gap={1} mt={1}>
                <AndroidIcon color="secondary" />
                <Typography variant="body2" color="text.secondary">
                  {entry.answer}
                </Typography>
              </Box>
            </Box>
          ))}
          <div ref={bottomRef} />
        </Paper>

        <Box display="flex" gap={1}>
          <TextField
            fullWidth
            size="small"
            variant="outlined"
            placeholder="Haz tu pregunta..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleAsk();
              }
            }}
          />
          <Button
            variant="contained"
            onClick={handleAsk}
            disabled={loading}
            endIcon={
              loading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <SendIcon />
              )
            }
          >
            ENVIAR
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

export default App;
