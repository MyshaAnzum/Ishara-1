import { speak } from "../utils/speech";

export default function RecognizedText({ prediction, onAddWord }) {
  const label = prediction ? prediction.label : "";

  return (
    <div>
      <p className="result">{label || "No sign matched"}</p>
      <div className="row">
        <button disabled={!label} onClick={() => onAddWord(label)}>
          Add to Sentence
        </button>
        <button disabled={!label} onClick={() => speak(label)}>
          Speak
        </button>
      </div>
    </div>
  );
}