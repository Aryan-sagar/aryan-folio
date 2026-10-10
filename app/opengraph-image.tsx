import { ImageResponse } from "next/og";

export const alt = "Aryan Sagar, AI engineer, software engineer, filmmaker";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%", height: "100%", background: "#050505", color: "#f2efe8",
          display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 28, color: "#a8a49c" }}>
          <div style={{ width: 14, height: 14, borderRadius: 14, background: "#ffa94d" }} />
          Open to opportunities
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 150, fontWeight: 700, lineHeight: 0.92, letterSpacing: -6 }}>ARYAN SAGAR</div>
          <div style={{ fontSize: 44, marginTop: 28, color: "#ffa94d" }}>AI Engineer · Software Engineer · Filmmaker</div>
        </div>
        <div style={{ display: "flex", fontSize: 30, color: "#a8a49c" }}>Engineer by profession. Filmmaker by obsession.</div>
      </div>
    ),
    { ...size }
  );
}