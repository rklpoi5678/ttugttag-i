import { Outlet } from "react-router";
import Navigation from "../../../src/components/landing/Navigation";
import Footer from "../../../src/components/landing/Footer";

export default function Layout() {
  return (
    <div>
      <Navigation />
      {/* will either be home.tsx or settings.tsx */}
      <Outlet />

      <Footer />
    </div>
  );
}
