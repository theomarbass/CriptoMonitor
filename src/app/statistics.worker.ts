/// <reference lib="webworker" />

addEventListener('message', ({ data }) => {
  const { prices } = data;
  if (!prices || prices.length === 0) return;

  const avg = prices.reduce((a: number, b: number) => a + b, 0) / prices.length;
  
  const squareDiffs = prices.map((p: number) => Math.pow(p - avg, 2));
  // Aquí agregamos los tipos :number para que TS esté feliz
  const volatility = Math.sqrt(squareDiffs.reduce((a: number, b: number) => a + b, 0) / prices.length);

  postMessage({ avg, volatility });
});

