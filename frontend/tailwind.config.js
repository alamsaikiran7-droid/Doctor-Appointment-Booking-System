/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0E1F1B",
        "ink-soft": "#3F544E",
        muted: "#6B7B77",
        bg: "#F6FAF8",
        surface: "#FFFFFF",
        line: "#E1EAE6",
        primary: {
          DEFAULT: "#0E7C66",
          dark: "#095C4C",
          light: "#E4F3EE",
          50: "#EDF7F4",
          100: "#DBF0E9",
        },
        accent: {
          DEFAULT: "#FF6B4A",
          dark: "#E2532F",
          light: "#FFEAE3",
        },
        gold: {
          DEFAULT: "#E8A33D",
          light: "#FDF2E0",
        },
      },
      fontFamily: {
        display: ["Newsreader", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["IBM Plex Mono", "monospace"],
      },
      boxShadow: {
        soft: "0 4px 24px -6px rgba(14, 31, 27, 0.08)",
        card: "0 12px 40px -12px rgba(14, 31, 27, 0.16)",
        lift: "0 20px 60px -16px rgba(9, 92, 76, 0.28)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      backgroundImage: {
        "grain": "radial-gradient(circle at 1px 1px, rgba(14,31,27,0.06) 1px, transparent 0)",
      },
    },
  },
  plugins: [],
};
