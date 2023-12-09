import type { Config } from "tailwindcss";
import colors from "tailwindcss/colors";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: colors.black,
          light: colors.neutral[900],
          lightest: colors.neutral[800],
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
