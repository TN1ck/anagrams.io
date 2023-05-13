import { defineConfig } from "vite";
import path from "path";
import react from "@vitejs/plugin-react";
import babel from "vite-plugin-babel";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    // babel({
    //   babelConfig: {
    //     babelrc: false,
    //     configFile: false,
    //     plugins: [
    //       [
    //         "@babel/plugin-proposal-decorators",
    //         { loose: true, version: "2022-03" },
    //       ],
    //     ],
    //   },
    // }),
    react({
      babel: {
        plugins: [
          ["@babel/plugin-proposal-class-static-block"],
          [
            "@babel/plugin-proposal-decorators",
            { loose: true, version: "2022-03" },
          ],
          ["@babel/plugin-proposal-class-properties"],
        ],
      },
      jsxRuntime: "classic",
    }),
  ],
  server: {
    port: 3400,
    open: "/",
  },
  resolve: {
    alias: {
      src: path.resolve(__dirname, "./src"),
    },
  },
});
