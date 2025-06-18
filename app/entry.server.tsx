import type { AppLoadContext, EntryContext } from "react-router";
import { ServerRouter } from "react-router";
import { isbot } from "isbot";
import { renderToReadableStream } from "react-dom/server";
import * as Sentry from "@sentry/react-router";
import { type HandleErrorFunction } from 'react-router'

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  routerContext: EntryContext,
  _loadContext: AppLoadContext
) {
  let shellRendered = false;
  const userAgent = request.headers.get("user-agent");

  const body = await renderToReadableStream(
    <ServerRouter context={routerContext} url={request.url} />,
    {
      onError(error: unknown) {
        responseStatusCode = 500;
        // Log streaming rendering errors from inside the shell.  Don't log
        // errors encountered during initial shell rendering since they'll
        // reject and get logged in handleDocumentRequest.
        if (shellRendered) {
          console.error(error);
        }
      },
    }
  );
  shellRendered = true;

  // Ensure requests from bots and SPA Mode renders wait for all content to load before responding
  // https://react.dev/reference/react-dom/server/renderToPipeableStream#waiting-for-all-content-to-load-for-crawlers-and-static-generation
  if ((userAgent && isbot(userAgent)) || routerContext.isSpaMode) {
    await body.allReady;
  }

  responseHeaders.set("Content-Type", "text/html");
  return new Response(body, {
    headers: responseHeaders,
    status: responseStatusCode,
  });
}

export const handleError: HandleErrorFunction = (error, { request }) => {
  // React Router는 중단된 요청을 취소할 수 있으므로, 해당 오류는 로깅하지 않습니다.
  // HTTP 응답 오류가 아니거나, 요청이 중단된 경우에만 Sentry에 전송합니다.
  if (!request.signal.aborted) {
    Sentry.captureException(error);
    // 선택적으로 오류를 콘솔에 로깅하여 서버 로그에서 볼 수 있도록 합니다.
    console.error(error);
  }
};
  