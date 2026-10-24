import { ImageResponse } from "next/og";
import { brand, GlobeMark } from "@/lib/brand-image";

export const alt = "Fit Planet: one pass for every gym on the planet";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const stamps = ["NYC", "BER", "DXB", "IST", "SYD", "LON"];

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: brand.canvas, padding: 72 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ width: 72, height: 72, borderRadius: 20, background: brand.ink, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <GlobeMark size={46} />
          </div>
          <div style={{ fontSize: 40, fontWeight: 700, color: brand.ink, letterSpacing: -1 }}>Fit Planet</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 84, fontWeight: 700, color: brand.ink, letterSpacing: -3, lineHeight: 1.02, maxWidth: 900 }}>One pass for every gym on the planet.</div>
          <div style={{ fontSize: 32, color: brand.muted }}>Find a gym in any city, book a day pass, walk in with a QR code.</div>
        </div>
        <div style={{ display: "flex", gap: 14 }}>
          {stamps.map((code) => (
            <div key={code} style={{ display: "flex", padding: "10px 22px", borderRadius: 999, border: `3px solid ${brand.ink}`, color: brand.ink, fontSize: 26, fontWeight: 700, letterSpacing: 3 }}>
              {code}
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
