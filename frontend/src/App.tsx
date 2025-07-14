import { useState } from "react";
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  ToggleButton,
  ToggleButtonGroup,
  Paper,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AndroidIcon from "@mui/icons-material/Android";

import { mockAnswer } from "./mock";
import type { ChatEntry } from "./types";
interface Props {
  onToggleTheme: () => void;
  themeMode: "light" | "dark";
}
function App({ onToggleTheme, themeMode }: Props) {
  const [question, setQuestion] = useState("");
  const [chat, setChat] = useState<ChatEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"real" | "mock">("real");

  const handleModeChange = (
    _: React.MouseEvent<HTMLElement>,
    newMode: "real" | "mock" | null
  ) => {
    if (newMode !== null) {
      setMode(newMode);
    }
  };

  const handleAsk = async () => {
    if (!question.trim()) return;
    setLoading(true);

    try {
      let data: { answer: string };

      if (mode === "real") {
        const response = await fetch("http://localhost:8000/ask", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question }),
        });
        data = await response.json();
      } else {
        data = await mockAnswer(question);
      }

      setChat([...chat, { question, answer: data.answer }]);
      setQuestion("");
    } catch (error) {
      setChat([
        ...chat,
        { question, answer: "❌ Error al obtener respuesta." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Box textAlign="center" mb={2}>
        <Button onClick={onToggleTheme} variant="outlined" size="small">
          Cambiar a tema {themeMode === "dark" ? "claro" : "oscuro"}
        </Button>
      </Box>
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          bgcolor: "background.default",
          color: "text.primary",
        }}
      >
        <Container maxWidth="xs" sx={{ py: 2 }}>
          <Typography variant="h5" align="center" gutterBottom>
            Chatbot
          </Typography>

          <Typography
            variant="caption"
            display="block"
            align="center"
            gutterBottom
          >
            Elige si deseas usar el backend real o una simulación
          </Typography>

          <ToggleButtonGroup
            value={mode}
            exclusive
            onChange={handleModeChange}
            size="small"
            color="primary"
            fullWidth
            sx={{ mb: 2 }}
          >
            <ToggleButton value="real">BACKEND</ToggleButton>
            <ToggleButton value="mock">SIMULADO</ToggleButton>
          </ToggleButtonGroup>

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

              /* Scroll personalizado */
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
                <Box display="flex" alignItems="center" gap={1}>
                  <AccountCircleIcon color="primary" />
                  <Typography variant="body2">{entry.question}</Typography>
                </Box>
                <Box display="flex" alignItems="center" gap={1} mt={1}>
                  <AndroidIcon color="secondary" />
                  <Typography variant="body2" color="text.secondary">
                    {entry.answer}
                  </Typography>
                </Box>
              </Box>
            ))}
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
    </>
  );
}

export default App;
