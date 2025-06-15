import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    layout("routes/landing/layout.tsx", [
        route("prices", "routes/landing/prices.tsx"),
        route("contact", "routes/landing/contact.tsx"),
        route("about", "routes/landing/about.tsx"),
        route("privacy", "routes/landing/privacy.tsx"),
        route("terms", "routes/landing/terms.tsx"),
    ]),

    route("login", "routes/auth/login.tsx"),
    route("signup", "routes/auth/signup.tsx"),

    layout("routes/dashboard/dashboard.tsx", [
        route("/dashboard/projects", "routes/dashboard/dashboard.projects.tsx"),
        route("/dashboard/settings", "routes/dashboard/dashboard.settings.tsx"),
        route("/dashboard/settings/profile", "routes/dashboard/dashboard.settings.profile.tsx"),
        route("/dashboard/settings/checkout", "routes/dashboard/dashboard.settings.checkout.tsx"),
        route("/dashboard/collaborators", "routes/dashboard/dashboard.collaborators.tsx"),
        route("/dashboard/checkout", "routes/dashboard/dashboard.checkout.tsx"),
    ]),
    route("/sketches", "routes/sketches/sketches.tsx"),
] satisfies RouteConfig;
