import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};

export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#0B0D10",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 40,
          border: "5px solid #60A5FA",
          color: "#E8F1FF",
          fontSize: 46,
          fontWeight: 700,
          fontFamily: "Inter, sans-serif",
        }}
      >
        TH
      </div>
    ),
    size,
  );
}
