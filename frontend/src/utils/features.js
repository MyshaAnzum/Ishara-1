export const toFeatures = (landmarks) => {
  const wrist = landmarks[0];
  const points = landmarks.flatMap((p) => [p.x - wrist.x, p.y - wrist.y]);
  const maxValue = Math.max(...points.map(Math.abs)) || 1;
  return points.map((value) => value / maxValue);
};