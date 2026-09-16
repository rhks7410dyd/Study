class RateLimiter:
    """슬라이딩 윈도우 방식 요청 제한기.
    max_requests: window_seconds 동안 허용할 최대 요청 수
    """

    def __init__(self, max_requests, window_seconds):
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self.requests = {}  # user_id -> timestamp 리스트

    def allow(self, user_id, timestamp):
        history = self.requests.setdefault(user_id, [])
        cutoff = timestamp - self.window_seconds
        history[:] = [t for t in history if t > cutoff]

        if len(history) <= self.max_requests:
            history.append(timestamp)
            return True
        return False


def demo():
    rl = RateLimiter(max_requests=3, window_seconds=10)
    results = [rl.allow("u1", t) for t in [0, 1, 2, 3]]
    print(results)


if __name__ == "__main__":
    demo()
