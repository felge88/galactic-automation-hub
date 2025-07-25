import type { Config } from "tailwindcss"

// all in fixtures is set to tailwind v3 as interims solutions

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        orbitron: ["var(--font-orbitron)", "monospace"],
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        "jedi-blue": "#4f46e5",
        "sith-red": "#ef4444",
        "space-gray": "#374151",
        "space-dark": "#111827",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        float: {
          "0%": {
            transform: "translateY(0px)",
          },
          "50%": {
            transform: "translateY(-20px)",
          },
          "100%": {
            transform: "translateY(0px)",
          },
        },
        glitch: {
          "0%, 100%": {
            textShadow: "0px 0px #fff, 0px 0px #fff, 0px 0px #fff, 0px 0px #fff, 0px 0px #fff",
          },
          "20%": {
            textShadow: "0px 0px #00ff00, 0px 0px #00ff00, 0px 0px #00ff00, 0px 0px #00ff00, 0px 0px #00ff00",
          },
          "40%": {
            textShadow: "0px 0px #ff0000, 0px 0px #ff0000, 0px 0px #ff0000, 0px 0px #ff0000, 0px 0px #ff0000",
          },
          "60%": {
            textShadow: "0px 0px #0000ff, 0px 0px #0000ff, 0px 0px #0000ff, 0px 0px #0000ff, 0px 0px #0000ff",
          },
          "80%": {
            textShadow: "0px 0px #ffff00, 0px 0px #ffff00, 0px 0px #ffff00, 0px 0px #ffff00, 0px 0px #ffff00",
          },
        },
        sparkle: {
          "0%": {
            backgroundPosition: "0% 50%",
          },
          "50%": {
            backgroundPosition: "100% 50%",
          },
          "100%": {
            backgroundPosition: "0% 50%",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        float: "float 3s ease-in-out infinite",
        glitch: "glitch 2s infinite",
        sparkle: "sparkle 20s linear infinite",
      },
      boxShadow: {
        "neon-blue": "0 0 15px rgba(79, 70, 229, 0.5)",
        "neon-red": "0 0 15px rgba(239, 68, 68, 0.5)",
        "neon-green": "0 0 15px rgba(34, 197, 94, 0.5)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
export default config
