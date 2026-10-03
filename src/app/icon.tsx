import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

/** Favicon gerado no build: monograma "G" nas cores da marca (o mesmo da barra de menus da tela). */
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
          background: "#150e2c",
          color: "#b9a6ff",
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
