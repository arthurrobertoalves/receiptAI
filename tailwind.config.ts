import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3a6758',
          on: '#ffffff',
          container: '#a7d7c5',
          'on-container': '#325f51',
          fixed: '#bcedda',
          'fixed-dim': '#a1d1bf',
        },
        secondary: {
          DEFAULT: '#5c5f60',
          on: '#ffffff',
          container: '#e1e3e4',
          'on-container': '#626566',
        },
        tertiary: {
          DEFAULT: '#83514c',
          on: '#ffffff',
          container: '#febdb6',
          'on-container': '#7a4a45',
          fixed: '#ffdad6',
          'fixed-dim': '#f7b7b0',
        },
        error: {
          DEFAULT: '#ba1a1a',
          on: '#ffffff',
          container: '#ffdad6',
          'on-container': '#93000a',
        },
        surface: {
          DEFAULT: '#f9faf7',
          bright: '#f9faf7',
          dim: '#d9dad8',
          'container-lowest': '#ffffff',
          'container-low': '#f3f4f1',
          container: '#edeeeb',
          'container-high': '#e8e8e6',
          'container-highest': '#e2e3e0',
          variant: '#e2e3e0',
          tint: '#3a6758',
        },
        'on-surface': {
          DEFAULT: '#1a1c1b',
          variant: '#404945',
        },
        outline: {
          DEFAULT: '#717975',
          variant: '#c0c8c3',
        },
      },
      fontFamily: {
        sora: ['Sora', 'system-ui', 'sans-serif'],
        manrope: ['Manrope', 'system-ui', 'sans-serif'],
        grotesk: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-lg': ['48px', { lineHeight: '56px', letterSpacing: '-0.02em', fontWeight: '600' }],
        'headline-lg': ['32px', { lineHeight: '40px', letterSpacing: '-0.01em', fontWeight: '600' }],
        'headline-md': ['28px', { lineHeight: '36px', fontWeight: '600' }],
        'body-md': ['16px', { lineHeight: '24px', fontWeight: '400' }],
        'label-caps': ['12px', { lineHeight: '16px', letterSpacing: '0.05em', fontWeight: '500' }],
      },
      borderRadius: {
        '4xl': '32px',
        '5xl': '40px',
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(167, 215, 197, 0.10)',
        liquid: '0 20px 40px rgba(167, 215, 197, 0.10)',
        'liquid-strong': '0 20px 40px rgba(58, 103, 88, 0.25)',
        'liquid-glow': '0 0 40px rgba(167, 215, 197, 0.30)',
        shutter: '0 0 25px rgba(167, 215, 197, 0.60)',
      },
      backgroundImage: {
        'gradient-home': 'radial-gradient(circle at top right, #bcedda 0%, #f9faf7 40%)',
        'gradient-history': 'linear-gradient(135deg, #f9faf7 0%, #edeeeb 100%)',
        'specular': 'linear-gradient(180deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 100%)',
      },
      animation: {
        float: 'float 3s ease-in-out infinite',
        'float-delayed': 'float 3s ease-in-out infinite 0.5s',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
