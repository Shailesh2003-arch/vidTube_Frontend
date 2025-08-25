/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",

  theme: {
    extend: {
      fontFamily: {
        body: ["Inter", "system-ui", "sans-serif"],
        head: ["Poppins", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [require('tailwind-scrollbar-hide')],
};
