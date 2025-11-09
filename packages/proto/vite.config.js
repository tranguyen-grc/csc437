import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        login: resolve(__dirname, "login.html"),
        group: resolve(__dirname, "group.html"),
        receipt: resolve(__dirname, "receipt.html"),
        discount: resolve(__dirname, "discount.html"),
        item: resolve(__dirname, "item.html"),
        member: resolve(__dirname, "member.html"),
        price: resolve(__dirname, "price.html"),
        tax: resolve(__dirname, "tax.html"),
        ticket: resolve(__dirname, "ticket.html"),
        tip: resolve(__dirname, "tip.html"),
        total: resolve(__dirname, "total.html")
      }
    }
  }
});
