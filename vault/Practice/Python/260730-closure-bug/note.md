# 연습 — 클로저 버그 찾기

- 문제: `problem.py`의 `build_discount_functions`가 등급(tier)별로 다른 할인율 함수를 만들어야 하는데, 모든 등급이 같은 결과를 반환한다.
- 유형: 디버깅 (이전 레이트리미터 예제보다 난이도 상향 — 비교 연산자가 아니라 스코프/클로저 문제)

## 재현
```python
tiers = [
    {"name": "bronze", "rate": 0.05},
    {"name": "silver", "rate": 0.10},
    {"name": "gold", "rate": 0.20},
]
funcs = build_discount_functions(tiers)
for name in ["bronze", "silver", "gold"]:
    print(name, funcs[name](100))
# 기대: bronze 95.0 / silver 90.0 / gold 80.0 (등급마다 다른 값)
# 실제: 
bronze 80.0
silver 80.0
gold 80.0
```
직접 `python problem.py`로 실행해서 실제 출력을 확인해보세요.

## 진행 방법
[[디버깅-루틴|디버깅 루틴]]을 따라 아래 순서로 풀어보세요. AI 도구 없이 먼저 시도할 것.

1. 재현 — 실제로 세 함수가 같은 값을 반환하는지 확인
2. 가설 — 왜 세 함수가 서로 다른 `tier`를 참조하지 못하는지 문장으로 적기
3. 검증 — 가설대로 수정 후 재실행해서 세 값이 달라지는지 확인

## 접근
파이썬 내에서는 for 문 내에서는 당연하게도 하나의 변수는 동일 변수에 값을 대입해서 입력하게 되어 있으므로, lambda 함수를 다르게 했다고 해서 tier["rate"]의 값은 마지막의 0.8로서 참조하게 된다.
따라서 결론적으로 price는 80%의 가격으로 나올수 밖에 없어진다.
해당 부분을 아래와 같이 두 가지 방식으로 나누어서 수정할 수 있다.
### 독립된 메서드 작성
```python
def discount(rate)
    return 
```

## 관련 개념
- [[디버깅-루틴|디버깅 루틴]]
- [[Concepts/설명-능력|설명 능력]] — 왜 lambda가 마지막 tier 값만 참조하는지 한 문장으로 설명해볼 것
- [[Language/Python/클로저-루프-변수-캡처|클로저의 루프 변수 캡처 (Python)]]

## 회고
(풀고 난 후 기록)
