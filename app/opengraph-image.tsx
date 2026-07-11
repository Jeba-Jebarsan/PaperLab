import { ImageResponse } from "next/og";
import { LogoMark } from "@/components/brand/logo-mark";
import { BRAND } from "@/lib/brand";

export const alt = `${BRAND.name} — ${BRAND.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const CHIPS = ["Attention", "GANs", "ResNet", "YOLO", "BERT", "GPT-3"];

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: BRAND.colors.void,
          backgroundImage:
            "radial-gradient(circle at 26% 22%, rgba(59,130,246,0.38), transparent 55%), radial-gradient(circle at 78% 78%, rgba(79,209,197,0.28), transparent 55%)",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 30 }}>
          <LogoMark size={128} />
          <div style={{ display: "flex", fontSize: 84, fontWeight: 700, color: BRAND.colors.ink }}>
            Paper<span style={{ color: "#60a5fa" }}>Lab</span>
          </div>
        </div>
        <div
          style={{
            marginTop: 26,
            display: "flex",
            maxWidth: 840,
            textAlign: "center",
            fontSize: 32,
            color: "rgba(236,237,242,0.72)",
          }}
        >
          {BRAND.tagline}
        </div>
        <div style={{ marginTop: 38, display: "flex", gap: 14 }}>
          {CHIPS.map((chip) => (
            <div
              key={chip}
              style={{
                display: "flex",
                padding: "10px 20px",
                borderRadius: 999,
                border: "1px solid rgba(96,165,250,0.45)",
                color: "#60a5fa",
                fontSize: 22,
              }}
            >
              {chip}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
