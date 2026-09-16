# 연습 — 이터레이터 소진 버그 찾기

- 문제: `problem.py`의 `sum_and_max`가 숫자 모음의 합계와 최댓값을 함께 반환해야 하는데, 실행하면 에러가 난다.
- 유형: 디버깅 (이전 예제들과 달리 값이 틀리는 게 아니라 아예 실행이 실패하는 케이스)

## 재현
```python
gen = (n for n in range(1, 6))
total, highest = sum_and_max(gen)
print("total:", total, "highest:", highest)
# 기대: total: 15 highest: 5
# 실제: ?
```
직접 `python problem.py`로 실행해서 실제 출력(또는 에러)을 확인해보세요.

## 진행 방법
[[Concepts/디버깅-루틴|디버깅 루틴]]을 따라 아래 순서로 풀어보세요. AI 도구 없이 먼저 시도할 것.

1. 재현 — 위 코드를 실행해서 실제로 어떤 에러/결과가 나오는지 확인
2. 가설 — `sum(numbers)`와 `max(numbers)`가 같은 `numbers`를 받는데 왜 두 번째 호출에서 문제가 생기는지 문장으로 적기
3. 검증 — 가설대로 수정 후 재실행해서 정상적으로 15와 5가 나오는지 확인

## 접근
### 재현
실제 실행시 에러가 발생함.
주요 에러 내용은 아래와 같음.
```bash
> python ./problem.py
... # 중략
ValueError: max() iterable argument is empty
```
max 내부에 아무것도 없는 이유는 현재 for 문으로 제너레이터로 만드는 ()는 일회용이기 때문이다. 따라서 한번 사용된 total을 구하는 sum 메서드에서 사용된 이후에 없어지고, max에서는 사용되지 못하게된다.

### 가설
한번 사용된 이후에 해당 내용이 휘발되어 버리니 휘발되지 않도록 일반적인 리스트를 사용
() -> []로 리스트로 변경
```python
gen = [n for n in range(1,6)]
```
### 검증
가설의 내용으로 수정 뒤 출력 내용
```bash
> python ./problem.py
total: 15   highest: 5
```

## 관련 개념
- [[Concepts/디버깅-루틴|디버깅 루틴]]
- [[Concepts/설명-능력|설명 능력]] — 제너레이터(이터레이터)가 리스트와 달리 왜 "한 번 소진되면 끝"인지 한 문장으로 설명해볼 것
- [[Language/Python/제너레이터-소진|제너레이터/이터레이터 소진 (Python)]]

## 회고
()는 제너레이터 표현식(generator expression)이라 불리는 것으로서, 리스트와 다르게 해당 내용이 최초로 사용될 때, 그 때 연산을 돌려서 한번 사용하고 버리는 형태
그래서 total에서 한 번 sum에서 처음부터 끝까지 다 사용되고 버려졌는데,
이를 max 메서드에서 다시 사용하려고 하니까 비어있다고 에러가 뜬 것.

