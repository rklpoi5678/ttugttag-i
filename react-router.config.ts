import type { Config } from "@react-router/dev/config";
// import { sentryOnBuildEnd } from "@sentry/react-router";

export default {
  ssr: true,
  future: {
    unstable_viteEnvironmentApi: true,
  },
  // buildEnd: async ({ viteConfig, reactRouterConfig, buildManifest }) => {
  //   await sentryOnBuildEnd(viteConfig,reactRouterConfig, buildManifest);
  // },
} satisfies Config;
