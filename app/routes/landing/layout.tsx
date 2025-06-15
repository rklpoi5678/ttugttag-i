import { Outlet } from "react-router";
import Navigation from "@/components/landing/Navigation";
import Footer from "@/components/landing/Footer";

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
