import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

/** Favicon gerado no build: o mesmo monograma gravado na tampa do notebook. */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 16,
          background: "#12140b",
          color: "#b9c47f",
          fontSize: 44,
          fontWeight: 700,
          letterSpacing: -2,
        }}
      >
        G
      </div>
    ),
    size,
  );
}
