import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        globals: true,
        environment: "node", // default
        include: ["**/*.{test,spec}.ts"],
    },
});
