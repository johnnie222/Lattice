# Lattice project instructions

This file is the project-specific source of truth for product and engineering decisions. It supplements `AGENTS.md`.

## Product north star

**Lattice helps a user see the market, see their portfolio inside it, and understand what changed.**

The product should answer, in seconds:

1. What is happening in the market?
2. What is happening to me?
3. What changed since I last checked?
4. What matters next?

The core mental model is:

**market -> sector/theme -> stock -> my portfolio**

Preserve that continuity. Do not turn Lattice into a generic finance toolbox.

## Product principles

- **Visual first, glanceable, mobile first.** A user should understand the important state in seconds.
- **One visual language.** Market maps, sector/theme maps and portfolio maps should feel like one system.
- **Personalization is the moat.** Portfolio contribution, relative performance and personalized summaries matter more than generic finance features.
- **Clarity beats feature count.** Prefer a small number of high-signal features over charts, indicators, options tools, endless news feeds or screeners.
- **No ads.** Monetization should come from a useful free tier and Pro subscription.
- **Keep the free tier useful.** Do not cripple the product merely to force a paywall.
- **Do not copy competitor clutter.** Competitors validate demand for heatmaps; Lattice should win on focus, UX and personalization.
- **Accessibility/readability over density.** Tiny unreadable tiles are not a feature.
- **Dollar and percent context where useful.** Do not remove useful context merely to simplify a screen.

## Feature test

Before adding a feature, ask:

> Does this help the user understand the market, their portfolio, what changed, or what matters next?

If not, it is probably out of scope.

Features that strongly fit Lattice:
- portfolio contribution
- My Portfolio Today
- portfolio vs benchmark
- historical heatmaps
- Lattice Close
- Portfolio Pulse
- Market Changed
- Opening Bell
- meaningful alerts
- shareable maps
- Tomorrow
- concise AI portfolio brief
- portfolio-relevant news / Why Is It Moving, only when data economics make sense

Features to avoid or defer unless usage data proves demand:
- full charting/technical-analysis suite
- options platform
- broad stock screener
- generic endless news feed
- analyst-rating aggregation
- crypto/dividend/futures expansion just for feature parity
- international-market expansion without demand evidence

## Deterministic core before AI

AI is a **narrative layer**, not a source of truth.

Build reusable deterministic engines first:
1. **Portfolio Intelligence** — return, contribution, benchmark comparison, breadth, sector contribution, leaders/laggards.
2. **Market State** — current/open/close/previous snapshots, historical periods, meaningful diffs.
3. **Narrative** — My Portfolio Today, Lattice Close, Opening Bell, later AI brief/news context.

AI should receive structured facts produced by the first two layers. If AI is unavailable, the deterministic product must remain useful.

## Data architecture

Commercial production should follow:

**licensed market-data provider -> Lattice backend -> shared cache -> Lattice clients**

Rules:
- Never expose paid-provider API keys to the client.
- Never make each user directly consume the vendor API.
- Normalize provider payloads behind Lattice-owned types so vendors remain swappable.
- Shared market data should be fetched once and reused across users.
- Use session-aware refresh cadence; Lattice is a heatmap, not an execution terminal.
- Separate fast quote data from slow/static metadata such as sector, industry, membership and market-cap snapshots.
- Production commercial data must have explicit customer-facing display/redistribution rights.
- Do not rely on Yahoo Finance for the paid public product.
- Logos/assets also require commercial rights or visible attribution as required.

## Engineering workflow

- `main` is stable. Work in small branches/PRs.
- **One feature, one implementation owner.**
- Multiple agents may work in parallel only on non-overlapping surfaces.
- Build shared domain logic before UI consumers.
- Do not duplicate portfolio math inside components.
- Add tests for financial math, time-period calculations, entitlements and data normalization.
- Install with `npm ci`; if a dependency changes, commit the `package-lock.json` that `npm install` produces with it.
- `npm test` is the canonical suite and must stay green. It runs every `scripts/**/*.test.mjs` (platform: PWA/share card, preview, auth wiring) and every `src/**/*.test.ts` (product) in one run, so a failure in one never hides the other. Run a subset with `npm run test:app` or `npm run test:platform`.
- Prefer small reversible PRs over large rewrites.
- Rebase/update from `main` before starting dependent work.
- Do not let multiple agents independently invent schemas for the same feature.

## Agile rule

Release early, instrument behavior, then reprioritize.

Do not build the entire backlog before launch. The launch product should be strong enough to demonstrate the core value; later work should be driven by real usage, retention and conversion.

Important events to measure include:
- first open
- market/board view
- sector drill
- portfolio creation
- position added
- My Portfolio Today
- Lattice Close
- paywall/trial
- subscription start/renewal/cancel where available

Do not send sensitive portfolio dollar values to analytics.

## Current commercial hypothesis

Treat these as product hypotheses, not hard-coded constants:
- monthly Pro: about **$1.99**
- annual Pro: about **$14.99**
- launch/community first-year offer: about **$9.99**
- no ads
- annual plan should be the primary/default offer

The price may change as retention and willingness-to-pay data arrives.

## Public launch gate

Do not block Google Play setup/testing on the feature backlog. Start testing early.

Before production launch, require:
- licensed commercial market-data path
- shared backend/cache
- subscription entitlement + restore purchase flow
- privacy/Data Safety and financial-feature declarations as applicable
- clean Android identity/icon/name/release build
- basic analytics
- stable error handling
- commercial rights/attribution for logos/assets
- P0 product value: portfolio intelligence, My Portfolio Today, benchmark comparison, Lattice Close, historical periods

AI news, Why Is It Moving, widgets, replay and cloud sync are **not** launch blockers.
