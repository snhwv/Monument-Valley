// import vitePluginString from "vite-plugin-string";
// import viteESLint from "@ehutch79/vite-eslint";
import reactJsx from "vite-react-jsx";
const { resolve } = require("path"); //必须要引入resolve

export default {
  server: {
    port: 4000,
  },
  resolve: {
    alias: {
      "@env": resolve(__dirname, "src/env"), //把src改为@
      "@components": resolve(__dirname, "src/components"), //把src改为@
      "@constants": resolve(__dirname, "src/constants"), //把src改为@
      "@utils": resolve(__dirname, "src/utils"), //把src改为@
      "@game": resolve(__dirname, "src/game"), //把src改为@
    },
  },
  plugins: [
    reactJsx(),
    // vitePluginString(),
    // viteESLint({ include: ["./src/**/*.ts", "./src/**/*.tsx"] }),
  ],
};
