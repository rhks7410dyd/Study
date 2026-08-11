# 연습 — RateLimiter 버그 찾기

- 문제: `problem.py`의 `RateLimiter`가 윈도우당 허용해야 할 요청 수보다 **하나 더 많이** 통과시킨다.
- 유형: 디버깅

## 재현
```python
rl = RateLimiter(max_requests=3, window_seconds=10)
results = [rl.allow("u1", t) for t in [0, 1, 2, 3]]
print(results)
# 기대: [True, True, True, False]  (3개까지만 허용)
# 실제: ?
```
직접 `python problem.py`로 실행해서 실제 출력을 확인해보세요.

## 진행 방법
[[../../Concepts/디버깅-루틴|디버깅 루틴]]을 따라 아래 순서로 풀어보세요. AI 도구 없이 먼저 시도할 것.

1. 재현 — 위 코드를 실행해서 실제로 몇 번째 요청까지 허용되는지 확인
2. 가설 — 어느 줄이 문제인지 문장으로 적기
3. 검증 — 그 줄만 격리해서 확인, 수정 후 재실행

## 접근
(직접 풀면서 여기에 기록)
1. 실제실행시 [True, True, True, True]로 4개의 True가 반환됨.
하지만 실제로는 max_requests가 3이기 때문에 4번째 timestamp가 3으로 입력 될 때는 false가 출력되어야 함.
2. 16번째 줄이 문제라고 파악됨. 그 이유는 16번째 줄에서 이미 history 내에 request가 3개가 되었을때그만되어야 하는데, 3개 이하라는 <= 조건이 하나를 더 허용하게 해주는문제가 있음
3. 해당 사항 수정시, 아래와 같이 결과가 수정됨
```bash
python ./problem.py
[True, True, True, False]
```

## 관련 개념
- [[../../Concepts/디버깅-루틴|디버깅 루틴]]
- [[../../Concepts/설명-능력|설명 능력]] — 왜 그 줄이 문제인지 한 문장으로 설명해볼 것

## 회고
- 테스트용 문제이지만, 우선 파이썬의 기본 문법에 취약하다는 점을 파악할 수 있었음
- 로직 정합성에 대한 연습은 지금처럼 점차 난이도를 올려가는 것이 좋을 것 같음
