import type { RouteConfig } from "@react-router/dev/routes";
import { route } from "@react-router/dev/routes";

export default [
    route("dashboard/:dashbardId", "routes/dashboard/dashboard.tsx"),
    route("dashboard/:dashbardId/products", "routes/dashboard/dashboard.product.tsx"),
] satisfies RouteConfig;

