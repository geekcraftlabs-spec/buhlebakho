import { TopBar } from "./TopBar";
import { WaypointRail } from "./WaypointRail";
import { MobileDock } from "./MobileDock";
import { AdminShortcut } from "./AdminShortcut";
import { BackToTop } from "./BackToTop";
import { DesktopCartButton } from "./DesktopCartButton";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { CartToast } from "@/components/cart/CartToast";

export function SiteNav() {
  return (
    <>
      <AdminShortcut />
      <TopBar />
      <WaypointRail />
      <MobileDock />
      <DesktopCartButton />
      <BackToTop />
      <CartToast />
      <CartDrawer />
    </>
  );
}