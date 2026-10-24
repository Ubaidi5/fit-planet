// Brand colours as hex for generated images (ImageResponse doesn't read CSS variables)
export const brand = { ink: "#1c2550", volt: "#8fe0d2", canvas: "#eef0ec", paper: "#fdfdfc", muted: "#5b6280" };

/** The globe mark from the logo, as plain SVG for ImageResponse */
export function GlobeMark({ size, color = brand.volt }: { size: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="11" stroke={color} strokeWidth="2.6" />
      <path d="M4.5 19.5c6-3.2 16.8-3.2 23 0" stroke={color} strokeWidth="2.6" strokeLinecap="round" />
      <circle cx="16" cy="11.5" r="2.6" fill={color} />
    </svg>
  );
}
