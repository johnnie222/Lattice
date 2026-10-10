import { useEffect, useRef } from "react";
import { overlays } from "./back-stack.ts";

/**
 * Register an open overlay with the Back stack for as long as it's mounted,
 * so Android Back closes it (see back-stack.ts). No history entry is added.
 */
export function useDismissible(onDismiss: () => void) {
  const latest = useRef(onDismiss);
  useEffect(() => {
    latest.current = onDismiss;
  });
  useEffect(() => overlays.push(() => latest.current()), []);
}
