import { reactRouter } from "@react-router/dev/vite";
import { cloudflare } from "@cloudflare/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "path"
import { nodePolyfills } from "vite-plugin-node-polyfills";
import { sentryReactRouter, type SentryReactRouterBuildOptions } from '@sentry/react-router';

const sentryConfig: SentryReactRouterBuildOptions = {
  org: "meta-os",
  project: "ttugttag-i",
  // An auth token is required for uploading source maps.
  authToken: "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"
  // ...
};



export default defineConfig(config => {
  return {
    plugins: [
    cloudflare({ viteEnvironment: { name: "ssr" } }),
    tailwindcss(),
    reactRouter(),
    sentryReactRouter(sentryConfig, config),
    tsconfigPaths(),
    nodePolyfills(),
  ],
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV ||'development'),
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
}});
