"""Paced Gemini REST calls with bounded, quota-aware retries.

Limits are project/model specific: https://ai.google.dev/gemini-api/docs/rate-limits
REST retry guidance: https://ai.google.dev/gemini-api/docs/troubleshooting
"""
from __future__ import annotations
import datetime as dt
import math
import random
import re
import time
from email.utils import parsedate_to_datetime
from zoneinfo import ZoneInfo

import requests

_next_request = {}


class GeminiRequestError(RuntimeError):
    def __init__(self, status, quota_kind='unknown', retry_at=None, *, transport_error=None, elapsed_seconds=None):
        self.status = status
        self.quota_kind = quota_kind
        self.retry_at = retry_at
        self.transport_error = transport_error
        self.elapsed_seconds = elapsed_seconds
        # Never include raw provider messages, request headers or URLs.
        super().__init__(f'Gemini request failed (HTTP {status}; quota={quota_kind})')

    def diagnostic(self):
        result = {'provider': 'gemini', 'http_status': self.status,
                  'quota_kind': self.quota_kind, 'retry_at': self.retry_at}
        if self.transport_error is not None:
            result.update(transport_error=self.transport_error, elapsed_seconds=self.elapsed_seconds)
        return result


def quota_details(response):
    """Read only structured quota identifiers and retry hints; never log the body."""
    try:
        error = response.json().get('error', {})
    except (ValueError, AttributeError):
        error = {}
    if not isinstance(error, dict):
        error = {}
    identifiers = []
    retry_seconds = 0.0
    for detail in error.get('details', []):
        if not isinstance(detail, dict):
            continue
        if str(detail.get('@type', '')).endswith('QuotaFailure'):
            for violation in detail.get('violations', []):
                if isinstance(violation, dict):
                    identifiers.extend(str(violation.get(k, '')) for k in ('quotaMetric', 'quotaId'))
        if str(detail.get('@type', '')).endswith('RetryInfo'):
            match = re.fullmatch(r'(\d+(?:\.\d+)?)s', str(detail.get('retryDelay', '')))
            if match:
                retry_seconds = max(retry_seconds, float(match[1]))
    header = response.headers.get('Retry-After', '')
    try:
        seconds = float(header)
    except (TypeError, ValueError):
        try:
            seconds = parsedate_to_datetime(header).timestamp() - time.time()
        except (TypeError, ValueError, AttributeError, OverflowError):
            seconds = 0.0
    if math.isfinite(seconds):
        retry_seconds = max(retry_seconds, seconds)
    identifiers = ' '.join(identifiers).lower()
    # Some Interactions responses have no google.rpc details.
    message = str(error.get('message', '')).lower()
    if re.search(r'per.?day|daily', identifiers) or re.search(r'per day|daily quota', message):
        kind = 'daily'
    elif re.search(r'per.?minute|rpm|tpm', identifiers):
        kind = 'minute'
    else:
        kind = 'unknown'
    return kind, retry_seconds


def next_daily_reset():
    now = dt.datetime.now(ZoneInfo('America/Los_Angeles'))
    tomorrow = now.date() + dt.timedelta(days=1)
    return int(dt.datetime.combine(tomorrow, dt.time(), now.tzinfo).timestamp()) + 60


def post(url, *, key, model, payload, interval_seconds=65, max_attempts=5):
    """One request/minute by default, including retries, within this producer.

The workflow serializes all producer jobs. Other users of the same Google
project still share its quotas; the interval is a conservative policy, not a
claim about the account's actual limit.
    """
    interval_seconds = float(interval_seconds)
    if not math.isfinite(interval_seconds) or interval_seconds < 1:
        raise ValueError('Gemini request interval must be a positive finite number')
    for attempt in range(max_attempts):
        wait = max(0, _next_request.get(model, 0) - time.monotonic())
        if wait:
            print(f'Pacing Gemini {model}: waiting {math.ceil(wait)} seconds.', flush=True)
            time.sleep(wait)
        _next_request[model] = time.monotonic() + interval_seconds
        started = time.monotonic()
        transport_error = None
        try:
            response = requests.post(url, headers={'x-goog-api-key': key},
                                     json=payload, timeout=(10, 120))
        except requests.RequestException as error:
            # Class names only: raw exceptions can include keys, URLs or headers.
            transport_error = next((label for cls, label in [
                (requests.exceptions.ConnectTimeout, 'connect_timeout'),
                (requests.exceptions.ReadTimeout, 'read_timeout'),
                (requests.exceptions.SSLError, 'tls_error'),
                (requests.exceptions.ProxyError, 'proxy_error'),
                (requests.exceptions.ConnectionError, 'connection_error'),
                (requests.exceptions.Timeout, 'timeout'),
            ] if isinstance(error, cls)), 'request_error')
            response = None
        elapsed_seconds = round(max(0, time.monotonic() - started), 3)
        if response is not None and response.status_code == 200:
            return response.json()
        status = response.status_code if response is not None else 0
        kind, hint = quota_details(response) if response is not None else ('unknown', 0)
        if status == 429 and kind == 'daily':
            raise GeminiRequestError(status, kind, max(next_daily_reset(), int(time.time() + hint)))
        if transport_error == 'tls_error' or status not in (0, 408, 429, 500, 502, 503, 504) or attempt == max_attempts - 1:
            raise GeminiRequestError(status, kind, transport_error=transport_error,
                                     elapsed_seconds=elapsed_seconds if transport_error else None)
        delay = max(hint, min(300, interval_seconds * 2 ** attempt)) + random.uniform(1, 5)
        # Long provider cooldowns should defer the job, not consume a runner.
        if delay > 600:
            raise GeminiRequestError(status, kind, int(time.time() + delay))
        detail = f'; transport={transport_error}; elapsed={elapsed_seconds}s' if transport_error else ''
        print(f'Gemini HTTP {status}; quota={kind}{detail}; retry in {math.ceil(delay)} seconds.', flush=True)
        time.sleep(delay)
    raise ValueError('Gemini max_attempts must be positive')
