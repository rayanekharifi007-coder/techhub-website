import { ImageResponse } from "next/og";

export const size = {
  width: 512,
  height: 512,
};

export const contentType = "image/png";

export default function Icon() {
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
          borderRadius: 96,
          border: "10px solid #60A5FA",
          color: "#E8F1FF",
          fontSize: 88,
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
