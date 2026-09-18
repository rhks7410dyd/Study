# Concept 작성 TODO 리스트

Practice에서 다뤘지만 Concepts/Language에 아직 문서화되지 않은 개념들. 우선순위 순으로 정렬.

## 1순위 — Python (회고에 내용이 이미 있어 옮겨 적기만 하면 됨)

- [ ] 가변 기본값 인자 (mutable default argument) — `[[Language/Python/가변-기본값-인자]]`
  - 출처: `260810-shared-list-bug`
  - `def f(items=[])`의 함정, `None` 센티널 패턴
- [ ] `__init__` vs `__new__`
  - 출처: `260810-shared-list-bug` 회고에서 "따로 정리 필요"라고 명시
  - 인스턴스 생성 과정에서 둘의 역할 차이
- [ ] 제너레이터/이터레이터 소진 — `[[Language/Python/제너레이터-소진]]`
  - 출처: `260811-iterator-exhaustion-bug`
  - 제너레이터 표현식 vs 리스트, 1회성 소비, `StopIteration`
- [ ] 순회 중인 리스트를 직접 변경하기 — `[[Language/Python/리스트-순회중-변경]]`
  - 출처: `260812-list-mutation-while-iterating-bug`
  - 인덱스 밀림 문제, `reversed()` 우회, list comprehension, in-place two-pointer(`write` 인덱스) 패턴
- [ ] 얕은 복사 vs 깊은 복사 — `[[Language/Python/얕은-복사-깊은-복사]]`
  - 출처: `260916-shallow-copy-bug`
  - `.copy()`/`copy.copy()`는 최상위만 복사, `copy.deepcopy()` 필요 시점, `id()`로 참조 동일성 확인
- [ ] 클로저의 루프 변수 캡처 — `[[Language/Python/클로저-루프-변수-캡처]]`
  - 출처: `260730-closure-bug`
  - 지연 바인딩(late binding), 기본 인자로 캡처하는 우회법(`lambda r=rate: ...`)

## 2순위 — Java

- [ ] `==` vs `.equals()`, 문자열 인터닝 — `[[Language/Java/문자열-비교-equals-vs-동등연산자]]`
  - 출처: `260810-string-equality-bug-java`
  - 상수 풀(constant pool), 리터럴 vs `new String()`, `intern()` 메서드
- [ ] 정수 나눗셈과 타입 캐스팅 — `[[Language/Java/정수-나눗셈-타입-캐스팅]]`
  - 출처: `260819-integer-division-bug-java`
  - `int/int` 버림, 명시적/암시적 캐스팅, 혼합 연산에서 타입 승격 규칙

## 3순위 — 대조/기초 개념

- [ ] 나눗셈 연산자 `/` vs `//` (Python) — `[[Language/Python/나눗셈-연산자]]`
  - 출처: `260819-integer-division-bug-java` 회고에서 Java와 비교 대상으로 언급
  - Python `/`는 항상 float, `//`는 floor division
- [ ] 삼항 연산자 문법 (Java `? :` vs Python `A if cond else B`)
  - 출처: `260916-shallow-copy-bug` 회고 — Java식 `? :`를 Python에 그대로 쓰다 `SyntaxError`
- [ ] 리스트/뮤터블 객체의 참조 공유 원리 (Python)
  - 8, 10번 개념의 공통 배경 — "파이썬 변수는 포인터를 담는다"는 원리를 별도 문서로 분리하면 재사용 가능

## 4순위 — 메타 개념 (Concepts, 언어 무관)

- [ ] 디버깅 3단계(재현→가설→검증) 루틴 보강
  - 기존 `디버깅-루틴.md`에 실제로 걸렸던 함정 사례 추가 (재현 코드 없이 눈으로 훑기, 가설을 문장으로 안 적고 바로 수정 등)
- [ ] "조용히 틀린 값" vs "실행 자체가 실패"하는 버그 유형 구분
  - 여러 노트의 `유형` 메타데이터에서 반복 등장하지만 문서화된 적 없음
