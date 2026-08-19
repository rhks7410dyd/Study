# 연습 — 평균 계산 버그 찾기 (Java)

- 문제: `Problem.java`의 `average`가 점수 리스트의 평균을 반환해야 하는데, 값이 이상하게 나온다.
- 유형: 디버깅 (에러 없이 조용히 틀린 값이 나오는 케이스 — 이번엔 자바 타입 관련)

## 재현
```java
List<Integer> scores = Arrays.asList(90, 80, 70);
System.out.println("average: " + average(scores));
// 기대: average: 80.0
// 실제: ?
```
직접 `javac Problem.java && java ScoreBoard`로 실행해서 실제 출력을 확인해보세요.

## 진행 방법
[[../../Concepts/디버깅-루틴|디버깅 루틴]]을 따라 아래 순서로 풀어보세요. AI 도구 없이 먼저 시도할 것.

1. 재현 — 실제로 어떤 값이 나오는지 확인 (기대와 다른지)
2. 가설 — `average`의 반환 타입은 `double`인데 왜 결과가 정수처럼 나오는지 문장으로 적기
3. 검증 — 가설대로 수정 후 재실행해서 `80.0`이 나오는지 확인

## 접근
### 재현


### 가설


### 검증


## 관련 개념
- [[../../Concepts/디버깅-루틴|디버깅 루틴]]
- [[../../Concepts/설명-능력|설명 능력]] — `sum / scores.size()`가 왜 `int` 나눗셈으로 계산되는지, `double`로 바꾸려면 어디를 캐스팅해야 하는지 한 문장으로 설명해볼 것

## 회고
