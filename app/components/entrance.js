// A circle centred on the eye must cover all four corners, on any viewport.
export function expansionCircle({ x, y }, { width, height }) {
  const radius = Math.ceil(Math.max(
    Math.hypot(x, y), Math.hypot(width - x, y),
    Math.hypot(x, height - y), Math.hypot(width - x, height - y),
  )) + 2;
  return { x, y, radius, diameter: radius * 2 };
}
