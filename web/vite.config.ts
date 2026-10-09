import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import { defineConfig, loadEnv } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  if (env.VITE_APP_API_URL === undefined || env.VITE_APP_API_URL === "") {
    throw new Error(" VITE_APP_API_URL is not defined");
  }

  return {
    plugins: [react(), tailwindcss(), babel({ presets: [reactCompilerPreset()] })],

    define: {
      __APP_ENV__: JSON.stringify(env.APP_ENV),
    },

    server: {
      port: env.APP_PORT !== undefined && env.APP_PORT !== "" ? Number(env.APP_PORT) : 5173,
      proxy: {
        "/api": {
          target: `${env.VITE_APP_API_URL}/v1`,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
    },
  };
});
