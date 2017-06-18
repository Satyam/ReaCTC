export default function splitCoords(coords) {
  const parts = coords.split(',');
  return [parseInt(parts[0], 10), parseInt(parts[1], 10)];
}
