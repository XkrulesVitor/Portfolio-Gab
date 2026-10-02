import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { profile } from "@/content/profile";

export const alt = `${profile.name} | Portfólio`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Card de compartilhamento (LinkedIn, WhatsApp...), gerado estaticamente no build. */
export default async function OpengraphImage() {
  const photo = await readFile(join(process.cwd(), "src/assets/images/gabriela.jpg"));
  const photoSrc = `data:image/jpeg;base64,${photo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          gap: 64,
          padding: "0 88px",
          background:
            "radial-gradient(60% 80% at 20% 100%, rgba(124,140,70,0.45), transparent 70%), radial-gradient(50% 60% at 90% 0%, rgba(198,174,130,0.25), transparent 70%), #0b0b0a",
          color: "#f1f0ec",
        }}
      >
        {/* ImageResponse (Satori) só entende <img>, não o componente next/image. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photoSrc}
          alt=""
          width={340}
          height={440}
          style={{ borderRadius: 28, objectFit: "cover", objectPosition: "50% 30%", border: "1px solid rgba(255,255,255,0.12)" }}
        />
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 620 }}>
          <div style={{ fontSize: 76, fontWeight: 700, letterSpacing: -3, lineHeight: 1 }}>{profile.name}</div>
          <div style={{ marginTop: 28, fontSize: 30, lineHeight: 1.4, color: "#a09e97" }}>{profile.hero.lead}</div>
        </div>
      </div>
    ),
    size,
  );
}
