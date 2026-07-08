import { ImageResponse } from "next/og";

export const alt = "THE WORLD'S GREATEST WATER — ELEV8 WATER";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #5e2d91 0%, #120826 50%, #060608 100%)",
        }}
      >
        <div
          style={{
            fontSize: 64,
            fontWeight: 600,
            color: "#ffffff",
            letterSpacing: 4,
            display: "flex",
            textAlign: "center",
          }}
        >
          THE WORLD&apos;S GREATEST WATER
        </div>
        <div
          style={{
            marginTop: 20,
            fontSize: 30,
            color: "#3dd6cb",
            letterSpacing: 8,
            textTransform: "uppercase",
            display: "flex",
          }}
        >
          ELEV8 WATER
        </div>
      </div>
    ),
    { ...size },
  );
}
