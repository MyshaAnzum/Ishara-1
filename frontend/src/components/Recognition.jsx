import { useRef, useState } from "react";
import useHandTracking from "../hooks/usehandtracking";
import RecognizedText from "./RecognizedText";
import { predictSign, saveSample } from "../api";

const SAMPLES_PER_SIGN = 30;

export default function Recognition({ onAddWord }) {
  const videoRef = useRef(null);
  const recordingRef = useRef({ active: false, count: 0, label: "" });
  const [handFound, setHandFound] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [label, setLabel] = useState("");
  const [message, setMessage] = useState("");

  const record = async (features) => {
    const recording = recordingRef.current;
    recording.count += 1;

    try {
      const { total } = await saveSample(recording.label, features);

      if (recording.count >= SAMPLES_PER_SIGN) {
        recording.active = false;
        setMessage(`Done! "${recording.label}" trained. Total samples: ${total}`);
      } else {
        setMessage(`Recording ${recording.count}/${SAMPLES_PER_SIGN} - keep moving your hand slightly`);
      }
    } catch {
      recording.active = false;
      setMessage("Save failed. Is the backend running?");
    }
  };

  const handleResult = async (features) => {
    setHandFound(Boolean(features));

    if (!features) {
      setPrediction(null);
      return;
    }

    if (recordingRef.current.active) {
      record(features);
      return;
    }

    try {
      const result = await predictSign(features);
      setPrediction(result.label ? result : null);
    } catch {
      setMessage("Cannot reach backend. Is the server running?");
    }
  };

  const error = useHandTracking(videoRef, handleResult);

  const startRecording = () => {
    if (!label.trim()) {
      setMessage("Type the word first");
      return;
    }

    recordingRef.current = { active: true, count: 0, label: label.trim() };
    setPrediction(null);
    setMessage("Recording started. Hold the sign in front of the camera");
  };

  return (
    <section className="card">
      <h2>Sign to Text</h2>
      <video ref={videoRef} className="video" muted playsInline />
      {error && <p className="error">{error}</p>}
      <p>{handFound ? "✅ Hand detected" : "❌ No hand detected"}</p>

      <RecognizedText prediction={prediction} onAddWord={onAddWord} />

      <h3>Train a new sign</h3>
      <div className="row">
        <input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Bangla word or letter"
        />
        <button onClick={startRecording}>Record {SAMPLES_PER_SIGN} Samples</button>
      </div>
      <p>{message}</p>
    </section>
  );
}