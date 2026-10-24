import { ImageResponse } from "next/og";
import { brand, GlobeMark } from "@/lib/brand-image";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: brand.ink, borderRadius: 112 }}>
        <GlobeMark size={318} />
      </div>
    ),
    size,
  );
}
