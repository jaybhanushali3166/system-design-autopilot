import datetime as dt
from datetime import datetime as NativeDateTime
import unittest
from unittest.mock import Mock, patch

from automation import gemini_http as api


def response(status, error=None, headers=None):
    result = Mock(status_code=status, headers=headers or {})
    result.json.return_value = {'error': error} if error else {'ok': True}
    return result


class GeminiHttpTests(unittest.TestCase):
    def setUp(self):
        api._next_request.clear()
        self.clock = 1000.0
        self.sleeps = []
        def sleep(delay):
            self.sleeps.append(delay)
            self.clock += delay
        self.patches = [patch.object(api.time, 'monotonic', lambda: self.clock),
                        patch.object(api.time, 'sleep', sleep),
                        patch.object(api.random, 'uniform', return_value=1)]
        for p in self.patches:
            p.start()
            self.addCleanup(p.stop)

    def call(self, model='tts'):
        return api.post('https://example.test', key='private-key', model=model, payload={})

    @patch.object(api.requests, 'post')
    def test_long_script_response_and_safe_timeout_diagnostic(self, post):
        post.return_value=response(200)
        api.post('https://example.test',key='secret',model='script',payload={},read_timeout=240)
        self.assertEqual(post.call_args.kwargs['timeout'],(10,240))
        post.side_effect=api.requests.ReadTimeout('secret credential URL')
        with self.assertRaises(api.GeminiRequestError) as caught:
            api.post('https://example.test',key='secret',model='script',payload={},max_attempts=1)
        self.assertEqual(caught.exception.diagnostic()['transport_error'],'read_timeout')
        self.assertNotIn('secret',str(caught.exception.diagnostic()))

    @patch.object(api.requests, 'post')
    def test_invalid_timeout_never_sends_a_request(self, post):
        for value in [True,0,301,float('inf')]:
            with self.assertRaises(ValueError):
                api.post('https://example.test',key='secret',model='script',payload={},read_timeout=value)
        post.assert_not_called()

    @patch.object(api.requests, 'post')
    def test_consecutive_scenes_are_paced_without_waiting_for_429(self, post):
        starts = []
        def send(*args, **kwargs):
            starts.append(self.clock)
            return response(200)
        post.side_effect = send
        self.call(); self.call(); self.call()
        self.assertEqual(starts, [1000, 1065, 1130])

    @patch.object(api.requests, 'post')
    def test_retry_after_and_retry_info_are_honored(self, post):
        error = {'details': [{'@type': 'type.googleapis.com/google.rpc.RetryInfo', 'retryDelay': '180s'}]}
        post.side_effect = [response(429, error, {'Retry-After': '120'}), response(200)]
        self.call()
        self.assertGreaterEqual(sum(self.sleeps), 180)
        self.assertEqual(post.call_count, 2)

    @patch.object(api.requests, 'post')
    def test_daily_quota_defers_without_consuming_more_requests(self, post):
        error = {'message': 'sensitive provider content', 'details': [{
            '@type': 'type.googleapis.com/google.rpc.QuotaFailure', 'violations': [{
                'quotaMetric': 'generativelanguage.googleapis.com/generate_requests_per_model_per_day'}]}]}
        post.return_value = response(429, error)
        with self.assertRaises(api.GeminiRequestError) as caught:
            self.call()
        self.assertEqual(post.call_count, 1)
        self.assertEqual(caught.exception.quota_kind, 'daily')
        self.assertGreater(caught.exception.retry_at, api.time.time())
        self.assertNotIn('sensitive', str(caught.exception))
        self.assertNotIn('private-key', str(caught.exception.diagnostic()))

    @patch.object(api.requests, 'post')
    def test_minute_quota_uses_increasing_bounded_backoff(self, post):
        error = {'details': [{'@type': 'type.googleapis.com/google.rpc.QuotaFailure',
                             'violations': [{'quotaId': 'RequestsPerMinutePerProjectPerModel'}]}]}
        post.return_value = response(429, error)
        with self.assertRaises(api.GeminiRequestError):
            self.call()
        self.assertEqual(post.call_count, 5)
        self.assertEqual(self.sleeps, [66, 131, 261, 301])

    @patch.object(api.requests, 'post')
    def test_long_cooldown_is_deferred_not_retried_early(self, post):
        post.return_value = response(503, headers={'Retry-After': '1200'})
        with self.assertRaises(api.GeminiRequestError) as caught:
            self.call()
        self.assertEqual(post.call_count, 1)
        self.assertGreater(caught.exception.retry_at, api.time.time() + 1190)

    @patch.object(api.requests, 'post')
    def test_transient_network_failure_retries_but_permission_error_stops(self, post):
        post.side_effect = [api.requests.ConnectionError('private URL'), response(200)]
        self.assertEqual(self.call(), {'ok': True})
        post.reset_mock(); post.side_effect = None; post.return_value = response(403)
        with self.assertRaises(api.GeminiRequestError):
            self.call()
        self.assertEqual(post.call_count, 1)

    @patch.object(api.dt, 'datetime')
    def test_daily_reset_uses_pacific_day_including_dst(self, datetime):
        from zoneinfo import ZoneInfo
        for month, offset in [(7, 7), (12, 8)]:
            local = dt.date(2026, month, 17)
            datetime.now.return_value = Mock(date=lambda: local, tzinfo=ZoneInfo('America/Los_Angeles'))
            datetime.combine.side_effect = NativeDateTime.combine
            reset = NativeDateTime.fromtimestamp(api.next_daily_reset(), dt.timezone.utc)
            self.assertEqual((reset.hour, reset.minute), (offset, 1))


if __name__ == '__main__':
    unittest.main()
