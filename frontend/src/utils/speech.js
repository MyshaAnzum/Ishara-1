export const speak = (text) => {
  if (!text) return;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "bn-BD";
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
};