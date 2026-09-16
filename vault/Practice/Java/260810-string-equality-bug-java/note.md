# 연습 — 문자열 비교 버그 찾기 (Java)

- 문제: `Problem.java`의 `LoginChecker`가 같은 값의 비밀번호인데도 어떤 경우엔 로그인 체크가 실패한다.
- 유형: 디버깅 (Java의 `==`와 `.equals()` 차이 문제)

## 재현
```java
LoginChecker checker = new LoginChecker("hunter2");

String direct = "hunter2";
String fromInput = new String("hunter2");

System.out.println("direct login: " + checker.checkPassword(direct));
System.out.println("fromInput login: " + checker.checkPassword(fromInput));
// 기대: 둘 다 true (같은 문자열 값이므로)
// 실제: ?
```
직접 `javac Problem.java && java LoginChecker`로 실행해서 실제 출력을 확인해보세요.

## 진행 방법
[[Concepts/디버깅-루틴|디버깅 루틴]]을 따라 아래 순서로 풀어보세요. AI 도구 없이 먼저 시도할 것.

1. 재현 — 위 코드를 실행해서 실제로 `fromInput` 쪽이 다르게 나오는지 확인
2. 가설 — `direct`와 `fromInput`이 같은 문자열 값인데 왜 결과가 다른지 문장으로 적기
3. 검증 — 가설대로 수정 후 재실행해서 두 경우 모두 올바르게 나오는지 확인

## 접근
1. 재현
실제 실행시
```java
direct login : true
fromInput login : false
```

2. 가설
- java에서 =은 값,참조를대입하는 것.
- ==은 포인터 및 객체 자체가 같은 것인지 비교함.

따라서 값을 비교하기 위해서는 `.equals()`를 사용해야함.

3. 검증
`public boolean checkPassword(String input)`에서 ==으로 되어 있던 것을 `equals()` 메서드로 수정 후 실행

**변경 사항**
```java
public boolean checkPassword(String input){
    return this.correctPassword.equals(input);
}
```

**결과**
```java
direct login : true
fromInput login : true
```

## 관련 개념
- [[Concepts/디버깅-루틴|디버깅 루틴]]
- [[Concepts/설명-능력|설명 능력]] — Java에서 `==`가 문자열에 대해 무엇을 비교하는지, `.equals()`와 뭐가 다른지 한 문장으로 설명해볼 것
- [[Language/Java/문자열-비교-equals-vs-동등연산자|`==` vs `.equals()`, 문자열 인터닝 (Java)]]

## 회고
비교를 `==`으로 진행하여 잘못되었다는 점은 인지했고, `.equals()`를 사용해야됨을 이론적으로 알고있긴 하였지만 제대로 떠올리지 못했다. 왜냐하면 첫번째 결과인 `direct login`의 경우 `true`가 나와버렸기 때문이다.
### 첫번째 결과가 `true`인 이유
해당 이유는 jvm의 리터럴 때문이라는 것을 알게 되었다. 

리터럴이 정확히 무엇인지는 향후 추가적으로 개념 작성 필요함.

간단히 작성하자면 문자열의 경우 상수 문자열은 상수 풀이라고 똑같은 내용의 문자열이 여러번 정적으로 선언되더라도 객체를 하나만 미리 만들고 재사용함.
이를 인터닝(interning)이라고 함.

코드로서 표현하자면 아래의 결과는 `true`를 반환하게됨
```java
String ex1 = "example";
String ex2 = "example";
String ex3 = "exa"+"mple";
String ex4 = new String("example");
String ex5 = new StringBuilder("example").toString();
System.out.println(ex1==ex2);   //true
System.out.println(ex1==ex3);   //true
System.out.println(ex1==ex4);   //false
System.out.println(ex1==ex5);   //false
System.out.println(ex4==ex5);   //false
```

JVM에 작성된규칙이라, 해당 규칙을벗어나기 위해서는 `new String("example");`이나 런타임에 실행되는 메서드를 통해 값이 생성되어야한다.
