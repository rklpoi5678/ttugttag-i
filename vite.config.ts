import { reactRouter } from "@react-router/dev/vite";
import { cloudflare } from "@cloudflare/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "path"
import { nodePolyfills } from "vite-plugin-node-polyfills";
import { sentryVitePlugin} from '@sentry/vite-plugin'

export default defineConfig(config => {
  const SENTRY_AUTH_TOKEN = process.env.SENTRY_AUTH_TOKEN;

  if (!SENTRY_AUTH_TOKEN && config.command === 'build') {
    console.warn("SENTRY_AUTH_TOKEN is not set. Source maps will not be uploaded to Sentry.");
  }

  return {
    plugins: [
    cloudflare({ viteEnvironment: { name: "ssr" } }),
    tailwindcss(),
    reactRouter(),
    sentryVitePlugin({
      org: "meta-os",
      project: "ttugttag-i",
      authToken: SENTRY_AUTH_TOKEN,
      sourcemaps: {
        assets: './build/client/**' // 클라이언트 빌드 결과물의 경로를 정확히 표시
      },
      telemetry: false,
    }),
    tsconfigPaths(),
    nodePolyfills(),
  ],
  define: {
    'process.env.NODE_ENV': JSON.stringify(config.mode),
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  // build: {
  //   sourcemap: 'hidden',
  //   ssr: {
  //     external: ['konva', 'react-konva']
  //   }
  // },
  // ssr: {
  //   noExternal: ['konva', 'react-konva']
  // }
  optimizeDeps: {
    // 이 부분을 추가하여 @tldraw/assets를 Vite의 최적화 대상에서 제외합니다.
    // 이렇게 하면 tldraw의 assetUrls prop이 더 잘 적용됩니다.
    exclude: ['@tldraw/assets'],
    // 'tldraw' 자체는 계속 포함해도 됩니다.
    include: ['tldraw'],
  },

}});
