// GitHub Pages serves this repository from /openshelf. Change both values together, and nowhere
// else: every internal link goes through `baseUrl()` so a move to a domain is a two-line change.
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://kodji7202-code.github.io",
  base: "/openshelf",
  trailingSlash: "ignore",
  build: { format: "directory" },
  devToolbar: { enabled: false },
});
