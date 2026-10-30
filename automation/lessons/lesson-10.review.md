# Reviewed same-lesson fallback — 30 October 2026

Follow one public product image through a cache miss, origin fetch, eligible fill, fresh same-key hit and expiry. Shared cache eligibility depends on actual headers/rules. Private/no-store account responses must not be forced into shared caching. No invented latency values or universal faster claims.

Sources checked:
- https://developers.cloudflare.com/cache/concepts/cache-control/
- https://developers.cloudflare.com/cache/concepts/cache-responses/

Script passes schema/story/mechanism checks. Full unpublished hosted regression 41020270581 passed Varo, caption, render and encoded-story gates. A separate custom local product-image draft is for user review; publication not authorized.
