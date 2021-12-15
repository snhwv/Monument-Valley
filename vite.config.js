// import vitePluginString from "vite-plugin-string";
// import viteESLint from "@ehutch79/vite-eslint";
const { resolve } = require("path"); //必须要引入resolve

export default {
  server: {
    port: 4000,
  },
  alias: {
    "@env": resolve(__dirname, "src/env"), //把src改为@
    "@components": resolve(__dirname, "src/components"), //把src改为@
    "@constants": resolve(__dirname, "src/constants"), //把src改为@
  },
  plugins: [
    // vitePluginString(),
    // viteESLint({ include: ["./src/**/*.ts", "./src/**/*.tsx"] }),
  ],
};
