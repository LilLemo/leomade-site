// Pixel-art pointing hand, drawn pixel by pixel. Points right by default.
const HAND = [
  "....##..........",
  "...#ww#.........",
  "...#ww#.........",
  "...#ww#.........",
  "...#ww#########.",
  ".###wwwwwwwwwww#",
  "#gw#wwwwwwwwwww#",
  "#gw#ww#########.",
  "#gwwwwwwwww#....",
  "#gwwww#####.....",
  "#gwwwwwwwww#....",
  ".#gwww#####.....",
  "..#wwwwwww#.....",
  "...#######......",
];
const handInk = { "#": "#0c1a14", g: "#c3c8bd", w: "#fbfaf4" };
export default function PixelHand({ dir = "right" }) {
  return <svg className={`pixelHand ${dir}`} viewBox="0 0 16 14" shapeRendering="crispEdges" aria-hidden="true">
    {HAND.flatMap((row, y) => [...row].map((c, x) => (c === "." ? null : <rect key={`${x}-${y}`} x={x} y={y} width="1.02" height="1.02" fill={handInk[c]} />)))}
  </svg>;
}
