import { cn } from "@/lib/utils";

interface FauxQRProps {
  /** Seed so the same pass always renders the same pattern */
  seed?: string;
  size?: number;
  className?: string;
}

const GRID = 25;

function hash(seed: string) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return () => {
    h ^= h << 13;
    h ^= h >>> 17;
    h ^= h << 5;
    return ((h >>> 0) % 1000) / 1000;
  };
}

function isFinder(x: number, y: number) {
  const inBox = (bx: number, by: number) =>
    x >= bx && x < bx + 7 && y >= by && y < by + 7;
  return inBox(0, 0) || inBox(GRID - 7, 0) || inBox(0, GRID - 7);
}

/**
 * Decorative QR-style code for pass previews. It is not scannable; real
 * passes will render a server-signed code once bookings are backed by the DB.
 */
export function FauxQR({ seed = "fit-planet", size = 160, className }: FauxQRProps) {
  const rand = hash(seed);
  const cells: { x: number; y: number }[] = [];

  for (let y = 0; y < GRID; y++) {
    for (let x = 0; x < GRID; x++) {
      if (isFinder(x, y)) continue;
      if (rand() > 0.52) cells.push({ x, y });
    }
  }

  const finders = [
    [0, 0],
    [GRID - 7, 0],
    [0, GRID - 7],
  ];

  return (
    <svg
      viewBox={`0 0 ${GRID} ${GRID}`}
      width={size}
      height={size}
      className={cn("text-ink", className)}
      shapeRendering="crispEdges"
      aria-hidden="true"
    >
      {cells.map(({ x, y }) => (
        <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill="currentColor" />
      ))}
      {finders.map(([fx, fy]) => (
        <g key={`${fx}-${fy}`} fill="none" stroke="currentColor">
          <rect x={fx + 0.5} y={fy + 0.5} width={6} height={6} rx={1.4} strokeWidth={1} />
          <rect x={fx + 2} y={fy + 2} width={3} height={3} rx={0.6} fill="currentColor" stroke="none" />
        </g>
      ))}
    </svg>
  );
}
