import { defineConfig } from "electron-vite";
import path from "path"

export default defineConfig({
    main: {
        build: {
            rollupOptions: {
                input: {
                    index: "src/index.ts",
                },
            },
        },
    },

    preload: {
        build: {
            rollupOptions: {
                input: {
                    index: "src/preload.ts",
                },
            },
        },
    },

    renderer: {
        root: "src/renderer",
        build: {
            rollupOptions: {
                input: {
                    main: "src/renderer/index.html",
                },
            },
        },
        resolve: {
            alias: {
                "@html": process.env.VITEST
                    ? path.resolve(__dirname, "test/test-util/html.ts")
                    : path.resolve(__dirname, "src/renderer/src/ui/html.ts"),
            },
        },
    },
});
