// src/mock.ts
export const mockAnswer = (question: string): Promise<{ answer: string }> => {
  const respuestas = [
    'Interesante pregunta. Déjame pensar...',
    'Podrías reformularlo, por favor.',
    'Estoy procesando eso en mi memoria simulada',
    `¿Podrías aclararme a qué te refieres con "${question}"?`,
  ];

  const aleatoria = respuestas[Math.floor(Math.random() * respuestas.length)];

  return new Promise((resolve) => {
    setTimeout(() => resolve({ answer: aleatoria }), 1000);
  });
};
