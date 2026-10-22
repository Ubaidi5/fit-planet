import QRCode from "qrcode";
import { cn } from "@/lib/utils";

/**
 * Real, scannable QR code for a pass, rendered on the server as inline SVG.
 * It encodes only the pass code; the front desk looks the booking up from it.
 */
export async function PassQR({ code, size = 180, className }: { code: string; size?: number; className?: string }) {
  const svg = await QRCode.toString(code, {
    type: "svg",
    errorCorrectionLevel: "M",
    margin: 0,
    color: { dark: "#1c2550", light: "#ffffff00" },
  });
  return (
    <div
      role="img"
      aria-label={`QR code for pass ${code}`}
      className={cn("[&>svg]:size-full", className)}
      style={{ width: size, height: size }}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
