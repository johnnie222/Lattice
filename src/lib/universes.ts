import { BOARDS } from "@/data/universe";

/** Market groups in the order the Markets menu and the quick wheel show them. */
export const UNIVERSE_GROUPS = ["Index", "Sector ETF", "Thematic"] as const;

export type Universe = { id: string; title: string; detail: string };

/** Your portfolio first, then indexes, sector funds and themes. */
export function universes(bookName: string): Universe[] {
  return [
    { id: "book", title: bookName, detail: "Your portfolio" },
    ...UNIVERSE_GROUPS.flatMap((group) =>
      BOARDS.filter((board) => board.group === group).map((board) =>
        group === "Index"
          ? { id: board.id, title: board.title, detail: "Index" }
          : {
              id: board.id,
              title: board.name,
              detail: `${group === "Sector ETF" ? "Sector" : "Theme"} · ${board.title}`,
            },
      ),
    ),
  ];
}
