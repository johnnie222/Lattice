# Lattice bug ledger

GitHub Issues are the canonical bug tracker. This file defines severity and keeps a concise human-readable index.

## Severity

- **S0 — Critical:** security/privacy breach, destructive data loss, broken purchase entitlement, or a defect that makes production unsafe. Stop other work.
- **S1 — High:** materially wrong financial result, core flow unusable/crashing, or a defect likely to mislead users. Fix before the affected feature ships.
- **S2 — Medium:** meaningful degradation, test/CI reliability issue, or non-core flow broken. Schedule promptly; can coexist with unrelated feature work.
- **S3 — Low:** cosmetic/minor usability issue with a reasonable workaround. Fix opportunistically.

Bug issue titles should start with `[BUG S0]`, `[BUG S1]`, `[BUG S2]`, or `[BUG S3]`.

## Open

| Issue | Severity | Summary | Launch impact |
|---|---|---|---|
| #17 | S1 | Partial quote coverage can overstate portfolio return | Must be fixed before My Portfolio Today/full-return UI ships |
| #18 | S2 | `npm ci` fails because lockfile is out of sync | Developer/CI reliability |
| #19 | S2 | Canonical `npm test` stops before TypeScript product tests | Developer/CI reliability |

## Closed archive

| Issue | Severity | Summary | Resolution |
|---|---|---|---|
| #20 | S1 | Dollar contribution inflated when quotes were missing | Fixed in PR #16 review, commit `b917f63`; regression test added |

## Process

1. Every reproducible defect gets a GitHub issue unless it is fixed immediately before any shared branch/PR exists.
2. Financial-math defects are never hidden inside a UI feature ticket; link the bug from the feature issue.
3. A closed S0/S1 stays in the archive with its resolution and regression-test status.
4. Bugs found during review should record:
   - expected behavior
   - actual behavior
   - minimal reproduction
   - severity
   - affected feature/PR
   - regression test when practical
5. Do not downgrade severity merely because the app is pre-launch. Severity describes impact if shipped.
6. Before production launch, there must be no open S0 or S1 bugs in launch-critical surfaces.
