import {reactRouter} from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import {defineConfig} from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
    plugins: [tailwindcss(), reactRouter(), tsconfigPaths(), react()],
    server: {
        watch: {
            ignored: [
                '**/node_modules/**',
                '**/.git/**',
                '**/.idea/**', // Ignore IDE files
                '**/.vscode/**',
                '**/dist/**'
            ]
        }
    },
    base: "/"
});
