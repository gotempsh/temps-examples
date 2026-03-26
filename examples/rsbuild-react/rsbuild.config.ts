import { defineConfig } from "@rsbuild/core"
import { pluginReact } from "@rsbuild/plugin-react"

export default defineConfig({
  plugins: [pluginReact()],
  resolve: {
    alias: {
      "@": "./src",
    },
  },
  html: {
    template: "./src/index.html",
  },
})
