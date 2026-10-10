# Lattice commercial/data notes

This document captures current assumptions so implementation agents do not accidentally optimize for the wrong business model.

## Data needs today

The live quote model is intentionally small:
- symbol
- current/reference price
- daily change
- daily change percent

Slow/static metadata can be maintained separately:
- company name
- sector / industry
- index membership
- market-cap snapshot
- thematic basket membership/weights

This keeps the commercial feed requirement much smaller than a full terminal-grade market-data product.

## Production architecture

Preferred:

**licensed provider -> backend ingest/refresh -> shared persistent cache -> Lattice API -> clients**

The same market snapshot should serve many users.

The current process-local cache pattern is not enough for scaled/serverless production because instances can have separate caches and caches disappear on recycle.

## Provider status

Current candidates to validate commercially:
- **Tiingo** — explicit startup display-redistribution product; strong licensing clarity
- **Twelve Data** — potentially cheaper/business-friendly, but total US redistribution add-on cost must be confirmed in writing

Do not choose solely on headline API price. Confirm:
- paid consumer Android app display rights
- redistribution/external display rights
- pre/post-market coverage
- symbol limits / request accounting
- caching rights
- logos/profile/market-cap rights where relevant

Avoid a vendor whose billing counts every symbol lookup in a way that makes frequent 500+ symbol refreshes uneconomic.

## Other commercial dependencies

- Google Play subscription fees
- commercial hosting (free hobby hosting may prohibit commercial use)
- company logos/assets: use only with the required attribution or commercial rights
- news/AI is not required for V1

## Cost discipline

The product should be viable at a few hundred annual Pro subscribers, not require tens of thousands merely to cover fixed data costs.

Recurring-cost features need an explicit business case before entering P0/P1.

## AI/news

AI generation itself can be inexpensive when prompts are based on structured facts.

The expensive/legally sensitive part is often the news/catalyst feed and customer-facing display rights.

Therefore:
- deterministic Lattice Close first
- AI narrative second
- licensed portfolio news later
- Why Is It Moving only after commercial data economics are known
