import * as Sentry from "@sentry/react-router";

Sentry.init({
  dsn: "https://27ef0f62cc07c0345f7a7589c6dc64b9@o4509365761867776.ingest.us.sentry.io/4509518700871680",
  
  // Adds request headers and IP for users, for more info visit:
  // https://docs.sentry.io/platforms/javascript/guides/react-router/configuration/options/#sendDefaultPii
  sendDefaultPii: true,
});
