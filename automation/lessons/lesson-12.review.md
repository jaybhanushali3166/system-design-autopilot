# Lesson 12 editorial review

Storyboard v3: one orders workload. A table cursor scans rows at entry; the matching index then gives the query a different path. Customer/date filters, composite column ordering, covering queries and index-maintenance cost remain in the curriculum. No fabricated speed comparison. Cover/title use the user problem rather than a course introduction. Two practical ending checks, with clear subtitle spacing retained.

PostgreSQL caveats: leading equality conditions and the first range constrain a multicolumn B-tree scan; do not claim an index is unusable whenever a leftmost condition is absent. Index-only scans require covered columns and visibility checks; table visits can still occur. EXPLAIN shows the chosen plan, not a universal recommendation to add an index.

Sources checked 1 November 2026:
- https://www.postgresql.org/docs/current/indexes-multicolumn.html
- https://www.postgresql.org/docs/current/indexes-index-only-scans.html
- https://www.postgresql.org/docs/current/using-explain.html
- https://www.postgresql.org/docs/current/indexes.html

This exact script is a hash-pinned same-lesson fallback. It does not bypass speech alignment, browser checks, encoded-frame review or publication validation. Full pilot validation is recorded in the rollout report.
