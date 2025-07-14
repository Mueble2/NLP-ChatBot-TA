// src/components/ChatBubble.tsx
import { Paper, Typography } from '@mui/material';

interface Props {
  role: 'user' | 'bot';
  content: string;
}

export const ChatBubble = ({ role, content }: Props) => {
  const isUser = role === 'user';
  return (
    <Paper
      sx={{
        p: 2,
        mb: 2,
        bgcolor: isUser ? '#e3f2fd' : '#f1f8e9',
        alignSelf: isUser ? 'flex-end' : 'flex-start',
        maxWidth: '80%',
      }}
    >
      <Typography variant="caption" fontWeight="bold">
        {isUser ? 'Tú' : 'RAG'}
      </Typography>
      <Typography>{content}</Typography>
    </Paper>
  );
};
