# Lattice backlog

Prioritization rule: **user value x retention/revenue impact / effort, recurring cost and risk**.

Statuses:
- **NOW** = launch-critical work
- **NEXT** = retention/distribution after the core launch slice
- **LATER** = intelligence/expansion after usage data
- **AVOID** = deliberately out of scope unless evidence changes

## P0 — NOW: subscription-ready launch

| Rank | Issue | Feature | Value | Effort | New recurring cost | Notes |
|---:|---:|---|---|---|---|---|
| 1 | #1 | Portfolio intelligence engine | Very high | Low-Med | None | Foundation for several features |
| 2 | #2 | My Portfolio Today | Very high | Low | None | Personalization moat |
| 3 | #3 | Deterministic Lattice Close | Very high | Low | Near zero | Daily habit without AI |
| 4 | #4 | Historical periods 1W / 1M / YTD | Very high | Medium | Data/storage | Competitor users explicitly value periods |
| 5 | #5 | Licensed market data + shared cache | Critical | Medium | Yes | Commercial launch blocker |
| 6 | #6 | Play subscriptions + entitlement | Critical | Medium | Store fee | No ads; useful free tier |
| 7 | #7 | Product analytics / launch funnel | High | Low-Med | Low | Needed to reprioritize from evidence |
| 8 | #8 | Google Play production hardening | Critical | Medium | Low | Policy/store/release readiness |

### P0 release slice

A public paid launch does **not** need the full backlog. The target launch product is:

- current market / sector / theme maps
- current portfolio map
- portfolio contribution
- My Portfolio Today
- portfolio vs S&P 500
- deterministic Lattice Close
- 1D / 1W / 1M / YTD
- licensed/commercial quote path
- subscriptions + analytics + Play compliance

## P1 — NEXT: retention and organic distribution

| Rank | Issue | Feature | Value | Effort | New recurring cost | Notes |
|---:|---:|---|---|---|---|---|
| 9 | #9 | Portfolio Pulse + Market Changed | Very high | Medium | Low | “Did anything happen since I checked?” |
| 10 | #10 | Opening Bell + meaningful alerts | Very high | Medium | Push infra | Morning/intraday habit |
| 11 | #11 | Shareable market/portfolio cards | High | Low-Med | None | Product-led distribution |
| 12 | #12 | Tomorrow / earnings & events | High | Medium | Event feed | “What matters next?” |
| 13 | — | Market breadth/regime label | High | Low | None | Broad rally / narrow rally / mixed |
| 14 | — | Watchlist heatmap | High | Low-Med | Minimal | Habit without requiring ownership |
| 15 | — | Personal records / factual streaks | Medium | Low | Storage | Best day, beat-market streak, breadth records |

## P2 — LATER: intelligence

| Rank | Issue | Feature | Value | Effort | New recurring cost | Notes |
|---:|---:|---|---|---|---|---|
| 16 | #13 | AI Daily Brief | Very high | Medium | Low AI cost | Narrative over deterministic facts |
| 17 | #14 | Portfolio news matching | Very high | Med-High | News license | Relevant news only |
| 18 | #14 | Why Is It Moving | Very high | High | Potentially high | Ship only after licensing economics are known |
| 19 | — | Home-screen widget | High | Medium | Minimal | Strong passive retention |
| 20 | — | Cloud portfolio sync | Medium | Medium | Backend/auth | Only when multi-device demand justifies accounts |

## P3 — EXPERIMENTS / expansion

| Rank | Feature | Value | Effort/cost | Rule |
|---:|---|---|---|---|
| 21 | Heatmap Replay | High/differentiated | High | Prototype only after history is solid |
| 22 | More international markets | Medium | High licensing/QA | Demand-led |
| 23 | Crypto heatmaps | Medium | Medium | Demand-led |
| 24 | Dividend heatmaps | Medium | Medium | Demand-led |
| 25 | Futures/commodities | Medium | High data complexity | Demand-led |

## AVOID for now

Do not spend roadmap capacity on:
- full TradingView-style technical charts
- RSI/MACD/indicator suite
- options chain/screener
- broad stock screener
- generic news portal
- “everything finance” feature parity

These dilute the core product and create expensive data/licensing surfaces.

## Daily habit loop

Long-term retention should form a coherent rhythm:

**Morning:** Opening Bell  
**During market:** Map + Portfolio Pulse + meaningful Market Changed  
**Close:** Lattice Close / AI Brief  
**Evening:** Tomorrow

The goal is not notification volume; it is high-signal reasons to return.

## Backlog policy

- Re-rank after real Play test/production usage.
- New ideas do not automatically enter P0/P1.
- A high-effort or recurring-cost feature needs evidence of user demand.
- Keep launch scope smaller than the vision.
