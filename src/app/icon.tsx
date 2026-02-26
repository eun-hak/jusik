import { ImageResponse } from "next/og";
import React from "react";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        background: "#0A0A0A",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "7px",
      }}
    >
      {/* Burgundy accent bar */}
      <div
        style={{
          position: "absolute",
          bottom: "5px",
          left: "7px",
          right: "7px",
          height: "2px",
          background: "#6B2D3C",
          borderRadius: "1px",
        }}
      />
      <span
        style={{
          color: "white",
          fontSize: "17px",
          fontWeight: "700",
          fontFamily: "serif",
          letterSpacing: "-0.5px",
          marginBottom: "3px",
        }}
      >
        주
      </span>
    </div>,
    { ...size },
  );
}
