import { Box } from "@mui/material";

const TypingDots = () => (
  <Box
    sx={{
      display: "flex",
      gap: "4px",
      alignItems: "center",
      height: "24px",
      pl: "2px",
    }}
  >
    {[0, 1, 2].map((i) => (
      <Box
        key={i}
        sx={{
          width: "6px",
          height: "6px",
          borderRadius: "50%",
          backgroundColor: "text.secondary",
          animation: "bounce 1.2s infinite",
          animationDelay: `${i * 0.2}s`,
        }}
      />
    ))}

    <style>
      {`
        @keyframes bounce {
          0%, 80%, 100% {
            transform: scale(0);
            opacity: 0.3;
          }
          40% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}
    </style>
  </Box>
);

export default TypingDots;
