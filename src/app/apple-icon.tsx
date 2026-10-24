import { ImageResponse } from "next/og";
import { brand, GlobeMark } from "@/lib/brand-image";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// iOS rounds the corners itself, so the square is filled edge to edge
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: brand.ink }}>
        <GlobeMark size={112} />
      </div>
    ),
    size,
  );
}
