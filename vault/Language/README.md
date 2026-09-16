# Language — 언어별 개념 볼트 (계획)

## 목표 구조
지금은 `Concepts/`에 언어 무관 개념(디버깅 루틴, 설명 능력 등)만 있고,
`Practice/`는 날짜별 폴더 하나에 모든 언어가 섞여 있다.

궁극적으로는 아래처럼 언어 단위로 구획을 나눈다.

```
vault/
  Language/
    Python/   # 파이썬 언어 개념 노트 (원자적, 노트 하나 = 개념 하나)
    Java/     # 자바 언어 개념 노트
  Practice/
    Python/   # 파이썬 연습 폴더들
    Java/     # 자바 연습 폴더들
```

- `Practice/*/note.md`의 "관련 개념"에서 해당 언어 개념 노트를 링크한다.
- `Practice/YYMMDD-*` 폴더들은 `Practice/Python/`, `Practice/Java/`로 이미 옮김 (완료).
  개념 노트(`Language/Python/*.md`, `Language/Java/*.md`)는 아직 비어있는 TODO 상태.

## 만들어야 할 개념 노트 목록 (TODO)
아래는 지금까지의 연습에서 다룬 개념들이다. 직접 정리해서 노트를 채울 것 — 본인이 이해한 말로 써야 의미가 있음.

### Language/Python/
- [ ] 클로저의 루프 변수 캡처 (late binding) — 출처: [[Practice/Python/260730-closure-bug|260730-closure-bug]]
- [ ] 가변 기본값 인자 (mutable default argument) — 출처: [[Practice/Python/260810-shared-list-bug|260810-shared-list-bug]]
- [ ] 제너레이터/이터레이터 소진 (한 번 순회하면 끝) — 출처: [[Practice/Python/260811-iterator-exhaustion-bug|260811-iterator-exhaustion-bug]]
- [ ] 순회 중인 리스트를 직접 변경할 때 생기는 인덱스 밀림 — 출처: [[Practice/Python/260812-list-mutation-while-iterating-bug|260812-list-mutation-while-iterating-bug]]
- [ ] 얕은 복사 vs 깊은 복사 (포인터 공유, mutable/immutable에 따라 증상이 다르게 보이는 이유) — 출처: [[Practice/Python/260916-shallow-copy-bug|260916-shallow-copy-bug]]
- [ ] `/`와 `//`의 차이 (실수 나눗셈 vs 몫 나눗셈) — 출처: [[Practice/Java/260819-integer-division-bug-java|260819-integer-division-bug-java]]와 비교하며 정리하면 좋음

### Language/Java/
- [ ] `==`과 `.equals()`의 차이, 문자열 리터럴 풀(interning) — 출처: [[Practice/Java/260810-string-equality-bug-java|260810-string-equality-bug-java]]
- [ ] `int`/`int` 나눗셈이 잘리는 이유와 `double` 캐스팅 위치 — 출처: [[Practice/Java/260819-integer-division-bug-java|260819-integer-division-bug-java]]

## 아직 다루지 않았지만 후보로 남길 것
- `__init__` vs `__new__` 차이 — [[Practice/Python/260810-shared-list-bug|260810-shared-list-bug]] 회고에서 본인이 직접 정리하겠다고 언급함
- 리터럴/인터닝 개념 심화 — [[Practice/Java/260810-string-equality-bug-java|260810-string-equality-bug-java]] 회고에서 "향후 추가 작성 필요"라고 남김
