import { TopBar } from "./TopBar";
import { WaypointRail } from "./WaypointRail";
import { MobileDock } from "./MobileDock";
import { AdminShortcut } from "./AdminShortcut";
import { BackToTop } from "./BackToTop";
import { CartDrawer } from "@/components/cart/CartDrawer";

export function SiteNav() {
  return (
    <>
      <AdminShortcut />
      <TopBar />
      <WaypointRail />
      <MobileDock />
      <BackToTop />
      <CartDrawer />
    </>
  );
}