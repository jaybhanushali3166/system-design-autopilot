# Lesson 09 recovery — 29 October 2026

The existing Gemini draft was recovered from failed run 40793276621. Its saved feedback was available (3 recent and 12 mature observations, zero failed requests). The renewed-key retry 40842399951 exhausted three script request attempts without an HTTP response; no narration or video was generated there.

This reviewed recovery preserves one GET /orders example and the Insights-informed early physical payoff / practical close. It replaces the invalid opening, an unrelated gateway-policy detour, malformed selection endpoints, and an unqualified claim of transparent retry. Only this lesson source changes; production renderer, schedule, provider and Varo voice are unchanged.

Factual scope checked against primary documentation:
- NGINX active/passive health checks and configurable failure thresholds: https://docs.nginx.com/nginx/admin-guide/load-balancer/http-health-check/
- NGINX round-robin request distribution: https://docs.nginx.com/nginx/admin-guide/load-balancer/http-load-balancer/
- Kubernetes readiness and terminating endpoints / graceful draining: https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/

The story is a configured example, not a universal failover guarantee. Rendering and Gemini Varo narration still run through the existing hosted producer with all technical and encoded-opening gates. This recovery is generated as a draft because today's original publication window has passed.
