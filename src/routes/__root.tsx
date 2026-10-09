import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { AuthProvider } from "@/lib/auth/provider";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import { PwaRegister } from "@/components/pwa-register";
import appCss from "../styles.css?url";

const APP_NAME = "LATTICE";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { title: APP_NAME },
      { name: "theme-color", content: "#07080b" },
      { name: "description", content: "Live stock heatmaps for the S&P 500, Nasdaq 100, sector ETFs, and your book." },
    ],
    links: [
      { rel: "icon", type: "image/png", sizes: "192x192", href: "/icons/lattice-192.png" },
      { rel: "stylesheet", href: appCss },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@500;600&family=IBM+Plex+Sans:wght@400;500;600;700&display=swap",
      },
      { rel: "manifest", href: "/manifest.webmanifest?v=3" },
      { rel: "apple-touch-icon", sizes: "180x180", href: "/icons/lattice-180.png" },
    ],
  }),
  component: () => (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <PwaRegister />
        <PreviewHostBridge />
        <AuthProvider>
          <Outlet />
        </AuthProvider>
        <Scripts />
      </body>
    </html>
  ),
});
