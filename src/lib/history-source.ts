// Web: reference closes come through the app's server function, whose cache
// is shared by every user. The Android build swaps this module for
// history-source.native.ts.
import { fetchReferenceCloses } from "@/lib/history";
import type { ReferenceAnswer } from "@/lib/history-service";
import type { LookbackPeriod } from "@/lib/periods";

export function loadReferenceCloses(request: {
  symbols: string[];
  period: LookbackPeriod;
  anchor: string;
}): Promise<ReferenceAnswer> {
  return fetchReferenceCloses({ data: request });
}
