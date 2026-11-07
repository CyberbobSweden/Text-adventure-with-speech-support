import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        crt: {
          bg: "#0b0d0a",
          panel: "#12140f",
          amber: "#ffb000",
          amberDim: "#8a5f00",
          green: "#33ff66",
          red: "#ff4d4d",
          blue: "#5fb3ff",
        },
      },
      fontFamily: {
        mono: [
          "\"IBM Plex Mono\"",
          "\"Cascadia Mono\"",
          "\"Courier New\"",
          "monospace",
        ],
      },
      keyframes: {
        blink: { "0%,49%": { opacity: "1" }, "50%,100%": { opacity: "0" } },
        flicker: {
          "0%,100%": { opacity: "1" },
          "92%": { opacity: "1" },
          "93%": { opacity: "0.85" },
          "94%": { opacity: "1" },
        },
      },
      animation: {
        blink: "blink 1s step-start infinite",
        flicker: "flicker 6s infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;
