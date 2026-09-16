# 연습 — 평균 계산 버그 찾기 (Java)

- 문제: `Problem.java`의 `average`가 점수 리스트의 평균을 반환해야 하는데, 값이 이상하게 나온다.
- 유형: 디버깅 (에러 없이 조용히 틀린 값이 나오는 케이스 — 이번엔 자바 타입 관련)

## 재현
```java
List<Integer> scores = Arrays.asList(90, 85, 70);
System.out.println("average: " + average(scores));
// 기대: average: 81.66666666666667
// 실제: average: 81.0
```
직접 `javac Problem.java && java ScoreBoard`로 실행해서 실제 출력을 확인해보세요.

## 진행 방법
[[Concepts/디버깅-루틴|디버깅 루틴]]을 따라 아래 순서로 풀어보세요. AI 도구 없이 먼저 시도할 것.

1. 재현 — 실제로 어떤 값이 나오는지 확인 (기대와 다른지)
2. 가설 — `average`의 반환 타입은 `double`인데 왜 결과가 정수처럼 나오는지 문장으로 적기
3. 검증 — 가설대로 수정 후 재실행해서 `81.666...`이 나오는지 확인

## 접근
### 재현
실제 실행시 출력값
```bash
java ./Problem.java
average: 81.0
```
실제 수학적으로 계산시 기대값인 81.666666666...과 다르게 81.0이 나오는 모습이다.

### 가설
현재 내부 function의 return 값이 double이지만, 내부 코드에서 `sum / scores.size()`에서 `int`형 두 개의 나눗셈을 하기 때문에, 형변환이 일어나지 않고 81.6666...의결과를 버림해서 81이 return 값으로 들어가고, 이 값을 double로 형변환해서 81.0이라는 출력 값이 나온다.

따라서, sum을 double로 선언하기만 하면 double형을 int로 나누기 때문에 return에 값이 입력되기 전에도 제대로 소수점 버림 없이 진행할 수 있게 된다.

### 검증
#### 수정코드
```java
    public static double average(List<Integer> scores) {
        double sum = 0; //int -> double로수정
...
```

#### 실행 결과
```bash
java ./Problem.java
average: 81.66666666666667
```

## 관련 개념
- [[Concepts/디버깅-루틴|디버깅 루틴]]
- [[Concepts/설명-능력|설명 능력]] — `sum / scores.size()`가 왜 `int` 나눗셈으로 계산되는지, `double`로 바꾸려면 어디를 캐스팅해야 하는지 한 문장으로 설명해볼 것
- [[Language/Java/정수-나눗셈-타입-캐스팅|정수 나눗셈과 타입 캐스팅 (Java)]]
- [[Language/Python/나눗셈-연산자|나눗셈 연산자 `/` vs `//` (Python과 비교)]]

## 회고
전체적으로 너무 쉬운 문제라 딱히 할 건 없었지만, 잘못된부분이 있음.
정수형 / 정수형 나눗셈은 자연스럽게 정수 부분만 나눗셈을 진행하고 나머지는 계산 없이 바로 버려버린다는 점. (즉 81.6666...이 나오고 버리는게 아니라 그냥 81만 띡 나온다는거)

이 부분에서 Claude와 대화에서 햇갈리는 부분이 있었는데, python의 경우에는 `//`라는 몫 나눗셈 기호가따로 있음. 이건 python이 `/`은 무조건 실수형 나눗셈, `//`은 몫 나눗셈으로 구분을 해준거임.
