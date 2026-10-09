// Android (Capacitor) entry: the same Lattice screen on a client-only router,
// without the web shell's SSR, auth and preview plumbing.
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  createHashHistory,
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  RouterProvider,
} from "@tanstack/react-router";
import { Lattice } from "@/components/lattice";
import { AppErrorComponent } from "@/lib/error-component";
import { validateLatticeSearch } from "@/lib/view-search";
import "./mobile.css";

const rootRoute = createRootRoute({ component: Outlet });
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  validateSearch: validateLatticeSearch,
  component: Lattice,
});

const router = createRouter({
  routeTree: rootRoute.addChildren([indexRoute]),
  history: createHashHistory(),
  defaultErrorComponent: AppErrorComponent,
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
