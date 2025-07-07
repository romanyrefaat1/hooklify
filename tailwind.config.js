// tailwind.config.js
const defaultTheme = require("tailwindcss/defaultTheme")

module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          page: "#FFFAEB",
          surface: "#FFFFFF"
        },
        text: {
          primary: "#1F2937",
          secondary: "#4B5563",
          muted: "#9CA3AF"
        },
        color: {
          primary: "#F59E0B",
          primaryLight: "#FBBF24",
          primaryDark: "#B45309",
          primaryMuted: "#FEF3C7",
          secondary: "#3B82F6",
          secondaryMuted: "#DBEAFE",
          success: "#10B981",
          successMuted: "#D1FAE5",
          warning: "#FBBF24",
          warningMuted: "#FEF9C3",
          info: "#3B82F6",
          infoMuted: "#DBEAFE",
          danger: "#EF4444",
          dangerMuted: "#FEE2E2"
        },
        border: {
          DEFAULT: "#E5E7EB"
        }
      },
      fontFamily: {
        // Primary sans-serif stack - clean and modern
        sans: ["Inter", "SF Pro Display", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "Arial", "sans-serif"],
        // Secondary sans-serif for headings - more personality
        display: ["Poppins", "Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
        // Monospace for code
        mono: ["JetBrains Mono", "Fira Code", "Monaco", "Consolas", "monospace"]
      },
      fontSize: {
        xs: ["0.75rem", { lineHeight: "1.5", letterSpacing: "0.025em" }],
        sm: ["0.875rem", { lineHeight: "1.5", letterSpacing: "0.025em" }],
        base: ["1rem", { lineHeight: "1.6", letterSpacing: "0.015em" }],
        lg: ["1.125rem", { lineHeight: "1.6", letterSpacing: "0.015em" }],
        xl: ["1.25rem", { lineHeight: "1.5", letterSpacing: "0.01em" }],
        "2xl": ["1.5rem", { lineHeight: "1.4", letterSpacing: "0.005em" }],
        "3xl": ["1.875rem", { lineHeight: "1.3", letterSpacing: "-0.015em" }],
        "4xl": ["2.25rem", { lineHeight: "1.2", letterSpacing: "-0.025em" }],
        "5xl": ["3rem", { lineHeight: "1.1", letterSpacing: "-0.035em" }]
      },
      fontWeight: {
        light: "300",
        normal: "400",
        medium: "500",
        semibold: "600",
        bold: "700",
        extrabold: "800"
      },
      borderRadius: {
        button: "0.5rem",
        card: "0.75rem",
        modal: "1.5rem"
      },
      boxShadow: {
        sm: "0 1px 2px rgba(0, 0, 0, 0.05)",
        md: "0 4px 6px rgba(0, 0, 0, 0.1)",
        lg: "0 10px 15px rgba(0, 0, 0, 0.1)"
      },
      spacing: {
        1: "0.25rem",
        2: "0.5rem",
        3: "0.75rem",
        4: "1rem",
        6: "1.5rem",
        8: "2rem",
        10: "2.5rem",
        12: "3rem"
      }
    }
  },
  plugins: []
}