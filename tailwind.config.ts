import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
    // tailwind.config.js
    theme: {
      extend: {
        colors: {
          background: "var(--background)",
          foreground: "var(--foreground)",
          card: "var(--card)",
          "card-foreground": "var(--card-foreground)",
          popover: "var(--popover)",
          "popover-foreground": "var(--popover-foreground)",
          primary: "var(--primary)",
          "primary-foreground": "var(--primary-foreground)",
          secondary: "var(--secondary)",
          "secondary-foreground": "var(--secondary-foreground)",
          muted: "var(--muted)",
          "muted-foreground": "var(--muted-foreground)",
          accent: "var(--accent)",
          "accent-foreground": "var(--accent-foreground)",
          destructive: "var(--destructive)",
          "destructive-foreground": "var(--destructive-foreground)",
          border: "var(--border)",
          input: "var(--input)",
          ring: "var(--ring)",
          contrast: "var(--contrast)",
          "contrast-secondary": "var(--contrast-secondary)",
          "anti-contrast": "var(--anti-contrast)",
          "purple-text": "var(--purple-text)",
        },
        borderRadius: {
          lg: "var(--radius)",
        },
      },
    },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
