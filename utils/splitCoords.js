// @flow
export default function splitCoords(coords: string): Array<number> {
  return coords.split(',').map(part => parseInt(part, 10));
}
