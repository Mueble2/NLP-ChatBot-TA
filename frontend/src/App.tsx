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
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";

import type { ChatEntry } from "./types";
import TypingDots from "./components/TypingDots";
import { ArrowDownward } from "@mui/icons-material";

const fondo = `/batalla${Math.floor(Math.random() * 4 + 1)}.png`;

interface Props {
  onToggleTheme: () => void;
  themeMode: "light" | "dark";
}

function App({ onToggleTheme, themeMode }: Props) {
  const [question, setQuestion] = useState("");
  const [chat, setChat] = useState<ChatEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);

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

  // Botón de desplazamiento
  useEffect(() => {
    const chatBox = document.getElementById("chat-box");

    const handleScroll = () => {
      if (!chatBox) return;
      const isAtBottom =
        chatBox.scrollHeight - chatBox.scrollTop - chatBox.clientHeight < 50;
      setShowScrollButton(!isAtBottom);
    };

    chatBox?.addEventListener("scroll", handleScroll);
    return () => chatBox?.removeEventListener("scroll", handleScroll);
  }, []);

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

      const respuestaCompleta = data.respuesta;
      let currentIndex = 0;

      const escribir = () => {
        setChat((prev) => {
          const actualizado = [...prev];
          const actual = actualizado[actualizado.length - 1];
          actualizado[actualizado.length - 1] = {
            ...actual,
            answer: respuestaCompleta.slice(0, currentIndex),
          };
          return actualizado;
        });

        currentIndex++;
        if (currentIndex <= respuestaCompleta.length) {
          setTimeout(escribir, 20);
        } else {
          setLoading(false);
        }
      };

      escribir();
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
    <>
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundImage: `url(${fondo})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(4px)",
          opacity: themeMode === "dark" ? "100%" : "40%",
          zIndex: -1,
        }}
      />

      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor:
            themeMode === "dark"
              ? "rgba(18, 18, 18, 0.8)"
              : "rgba(255, 255, 255, 0.4)",
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

        <Container
          maxWidth="xs"
          sx={{
            backgroundColor: "background.default",
            mx: 0,
            py: 4,
            borderRadius: 3,
            boxShadow: "0px 4px 24px rgba(0, 0, 0, 0.5)",
          }}
        >
          <Typography variant="h5" align="center" gutterBottom>
            Habla con el Sgto. Tomás Rivas 🫡
          </Typography>

          <Paper
            id="chat-box"
            sx={{
              position: "relative",
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
              <Box key={i} display="flex" flexDirection="column" gap={1}>
                {/* Pregunta del usuario */}
                {entry.question && (
                  <Box display="flex" alignItems="flex-start">
                    <Box mr={1}>
                      <AccountCircleIcon color="primary" />
                    </Box>
                    <Box
                      sx={{
                        backgroundColor:
                          themeMode === "dark" ? "#2d2d2d" : "#f0f0f0",
                        borderRadius: "16px",
                        px: 2,
                        py: 1,
                        maxWidth: "80%",
                        position: "relative",
                      }}
                    >
                      <Typography variant="body2">{entry.question}</Typography>
                    </Box>
                  </Box>
                )}

                {/* Respuesta del asistente */}
                <Box display="flex" alignItems="flex-start">
                  <Box mr={1}>🫡</Box>
                  <Box
                    sx={{
                      backgroundColor:
                        themeMode === "dark" ? "#2d2d2d" : "#f0f0f0",
                      borderRadius: "16px",
                      px: 2,
                      py: 1,
                      maxWidth: "80%",
                      position: "relative",
                    }}
                  >
                    {entry.answer === "..." ? (
                      <TypingDots />
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        {entry.answer}
                      </Typography>
                    )}
                  </Box>
                </Box>
              </Box>
            ))}

            {/* Botón circular de desplazamiento */}
            {showScrollButton && (
              <Box
                sx={{
                  position: "sticky",
                  bottom: 8,
                  display: "flex",
                  justifyContent: "flex-end",
                  pr: 1,
                  mt: "auto",
                  zIndex: 2,
                  animation: "fadeInUp 0.3s ease-in-out",
                  "@keyframes fadeInUp": {
                    from: { opacity: 0, transform: "translateY(20px)" },
                    to: { opacity: 1, transform: "translateY(0)" },
                  },
                }}
              >
                <IconButton
                  onClick={() =>
                    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
                  }
                  sx={{
                    bgcolor: "primary.main",
                    color: "white",
                    "&:hover": { bgcolor: "primary.dark" },
                    width: 40,
                    height: 40,
                  }}
                >
                  <ArrowDownward fontSize="small" />
                </IconButton>
              </Box>
            )}
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
              disabled={loading || question === ""}
            >
              {loading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <SendIcon />
              )}
            </Button>
          </Box>
        </Container>
      </Box>
    </>
  );
}

export default App;
