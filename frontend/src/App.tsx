import { useState } from 'react';
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  CircularProgress,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

interface ChatEntry {
  question: string;
  answer: string;
}

function App() {
  const [question, setQuestion] = useState('');
  const [chat, setChat] = useState<ChatEntry[]>([]);
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!question.trim()) return;
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
      });

      const data = await response.json();
      setChat([...chat, { question, answer: data.answer }]);
      setQuestion('');
    } catch (error) {
      setChat([...chat, { question, answer: '❌ Error al conectarse al backend.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={4} mb={2}>
        <Typography variant="h4" gutterBottom>
          🤖 Chatbot RAG
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Escribe una pregunta y recibirás una respuesta generada con recuperación aumentada.
        </Typography>
      </Box>

      {chat.map((entry, i) => (
        <Paper key={i} sx={{ p: 2, my: 2 }}>
          <Typography fontWeight="bold">Tú:</Typography>
          <Typography mb={1}>{entry.question}</Typography>
          <Typography fontWeight="bold">RAG:</Typography>
          <Typography>{entry.answer}</Typography>
        </Paper>
      ))}

      <Box display="flex" gap={1} mt={2}>
        <TextField
          fullWidth
          label="Haz tu pregunta"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <Button
          variant="contained"
          onClick={handleAsk}
          disabled={loading}
          endIcon={loading ? <CircularProgress size={20} /> : <SendIcon />}
        >
          Enviar
        </Button>
      </Box>
    </Container>
  );
}

export default App;
