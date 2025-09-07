/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
    './src/**/*.{js,jsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // Brand (Lilac)
        brand: {
          100: '#F4F2FF',
          200: '#E9E5FF',
          300: '#E3DFFF',
          400: '#B8A9F8',
          500: '#9B8CF5',
          600: '#7D6EF0',
          700: '#6E5AE6',
          800: '#5E4EE0',
          900: '#4C3BC7'
        },
        // Action (Charcoal)
        action: {
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A'
        },
        // Neutrals
        neutral: {
          50: '#F6F5F3',
          100: '#FAFAF9',
          200: '#F1F5F9',
          250: '#E5E7EB',
          400: '#94A3B8',
          600: '#475569',
          700: '#334155',
          800: '#1F2937',
          900: '#111827'
        },
        // Status colors
        success: {
          600: '#16A34A'
        },
        warning: {
          600: '#B45309'
        },
        danger: {
          600: '#DC2626'
        },
        info: {
          600: '#0284C7'
        },
        // Negative action colors (light orange)
        negative: {
          bg: '#FFF7E6',
          text: '#9A3412',
          border: '#FED7AA',
          hover: '#FFEDD5'
        },
        // Priority colors
        priority: {
          low: {
            bg: '#F0FDF9',
            text: '#064E3B',
            border: '#A7F3D0'
          },
          medium: {
            bg: '#F3F0FF',
            text: '#5B21B6',
            border: '#DDD6FE'
          },
          high: {
            bg: '#FFF7E6',
            text: '#9A3412',
            border: '#FED7AA'
          }
        },
        // Workflow types
        workflow: {
          onboarding: {
            bg: '#EFF6FF',
            text: '#1E40AF',
            border: '#BFDBFE'
          },
          compliance: {
            bg: '#F0F9F4',
            text: '#166534',
            border: '#BBF7D0'
          },
          review: {
            bg: '#FEF3C7',
            text: '#92400E',
            border: '#FDE68A'
          },
          approval: {
            bg: '#FCF4FF',
            text: '#7C2D92',
            border: '#E9D5FF'
          }
        },
        // Legacy compatibility
        border: "var(--color-border)",
        input: "var(--color-input)",
        ring: "var(--color-ring)",
        background: "var(--color-background)",
        foreground: "var(--color-foreground)",
        primary: {
          DEFAULT: "var(--color-primary)",
          foreground: "var(--color-primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--color-secondary)",
          foreground: "var(--color-secondary-foreground)",
        },
        destructive: {
          DEFAULT: "var(--color-destructive)",
          foreground: "var(--color-destructive-foreground)",
        },
        muted: {
          DEFAULT: "var(--color-muted)",
          foreground: "var(--color-muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--color-accent)",
          foreground: "var(--color-accent-foreground)",
        },
        popover: {
          DEFAULT: "var(--color-popover)",
          foreground: "var(--color-popover-foreground)",
        },
        card: {
          DEFAULT: "var(--color-card)",
          foreground: "var(--color-card-foreground)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      animation: {
        "fade-in": "fadeIn 200ms ease-out",
        "slide-in": "slideIn 300ms ease-out",
        "scale-in": "scaleIn 200ms ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideIn: {
          "0%": { transform: "translateY(-10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
      boxShadow: {
        'subtle': '0 1px 3px rgba(0, 0, 0, 0.1)',
        'elevated': '0 10px 25px rgba(0, 0, 0, 0.15)',
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
  ],
}