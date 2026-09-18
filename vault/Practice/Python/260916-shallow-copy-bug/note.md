# 연습 — 얕은 복사 버그 찾기

- 문제: `problem.py`의 `clone_board`가 2D 보드를 복제해서 원본과 독립적인 새 보드를 반환해야 하는데, 복제본을 수정하면 원본도 같이 바뀐다.
- 유형: 디버깅 (에러 없이 조용히 틀린 값이 나오는 케이스 — shared-list 예제와 같은 계열이지만 원인은 다름)

## 재현
```python
original = [[0, 0, 0], [0, 0, 0]]
clone = clone_board(original)
clone[0][0] = 9
print("original:", original)
print("clone:", clone)
# 기대: original: [[0, 0, 0], [0, 0, 0]] / clone: [[9, 0, 0], [0, 0, 0]]
# 실제: original: [[9, 0, 0], [0, 0, 0]] / clone: [[9, 0, 0], [0, 0, 0]]
```
직접 `python problem.py`로 실행해서 실제 출력을 확인해보세요.

## 진행 방법
디버깅 루틴을 따라 아래 순서로 풀어보세요. AI 도구 없이 먼저 시도할 것.

1. 재현 — 위 코드를 실행해서 실제로 원본이 같이 바뀌는지 확인
2. 가설 — `board.copy()`가 왜 안쪽 리스트(각 행)까지는 복제하지 못하는지 문장으로 적기
3. 검증 — 가설대로 수정 후 재실행해서 원본이 더 이상 바뀌지 않는지 확인

## 접근
### 재현
실제 `python ./problem.py` 실행시, original과 clone이 모두 수정되는 문제가 발생함

### 가설
copy 메서드는 외부 리스트를 새로 만드나, 내부에 중첩된 두 개의 리스트에대해서는 copy하지 않게되기 때문에 실제 값이 들어있는 내부의 두 개의 리스트는 동일 인스턴스를 참조하게 되는 문제가 있는 것이다. 따라서 `copy` 모듈의 메서드인 `copy.deepcopy()`를 사용하도록 수정하면 해결될 것이다.

### 검증
#### 기존 코드
```python
def clone_board(board):
    return board.copy()
#후략
```
#### 변경 코드
```Python
#copy 모듈 추가
import copy

def clone_board(board):
    #return board.copy()
    return copy.deepcopy(board) #board.copy -> copy.deepcopy(board)로 수정
#후략
```

#### 실행 결과
```bash
python ./problem.py
original: [[0, 0, 0], [0, 0, 0]]
clone: [[9, 0, 0], [0, 0, 0]]
```

## 관련 개념
- [[Language/Python/얕은-복사-깊은-복사|얕은 복사 vs 깊은 복사 (Python)]]

### 요약
copy 모듈의 deepcopy를 사용하지 않았을 때, 외부 리스트만 새로 만들게 되는 문제 때문에 내부의 리스트들은 동일한 객체를 참조하게 되는 문제가 있었다.
### 일반화
기본 `.copy()` 메서드나 `copy.copy()`는 얕은 복사로서 겉의 리스트만 새로운 객체로 생성한다.
따라서 하위 객체의 포인터는 그대로 입력되기 때문에 문제가 발생한다.
여기서 정확한 파이썬 동작을 파악해야 이해할 수 있는 부분이있다.
어차피 최상위 객체만 새로 할당한다면, 내부에 다른 mutable한 객체가 있던 immutable한 객체가 있던 상관없이 동일 대상을 참조하게 된다.
하지만 왜 이중리스트와 같이 mutable 객체가 내부에 있는 경우 문제가 생기는지를 파악해야한다.
이에 대한 자세한 내용은 다음과 같은 부분을 참조해라. (파이썬 개념 vault 추후 생성 후 참조로 놨두기)
추가적으로, 해당 문제에서 차이점을 간단하게 나타내기 위해 아래 `def analyze()` 함수를 추가하여 실행하였다

#### 추가 함수
```python
def analyze(origin,clone):
    print("전체 리스트의 객체 id가 동일한가? : " + ("True" if id(origin) == id(clone) else "False"))
    print("하위 첫 리스트의 객체 id가 동일한가? : " + ("True" if id(origin[0]) == id(clone[0]) else "False"))
    print("하위 두 번째  리스트의 객체 id가 동일한가? : " + ("True" if id(origin[1]) == id(clone[1]) else "False"))
```

#### `demo` 변경
```python
def demo():
    #전략
    analyze() #추가
```
#### 수정 전 실행 결과
``` bash
original: [[9, 0, 0], [0, 0, 0]]
clone: [[9, 0, 0], [0, 0, 0]]
전체 리스트의 객체 id가 동일한가? : False
하위 첫 리스트의 객체 id가 동일한가? : True
하위 두 번째  리스트의 객체 id가 동일한가? : True
```

#### 수정 후 실행 결과
```bash
original: [[0, 0, 0], [0, 0, 0]]
clone: [[9, 0, 0], [0, 0, 0]]
전체 리스트의 객체 id가 동일한가? : False
하위 첫 리스트의 객체 id가 동일한가? : False
하위 두 번째  리스트의 객체 id가 동일한가? : False
```

### 정리
위의 결과에 알 수 있다시피, 수정 전 기준으로 내부 리스트들은 동일 객체를 참조한다. 이로 인해 동일 참조 객체 내부의 int를 바꾸게 됨으로서 동일하게 변경되는 것이다.
이를 통해 배운 점은 파이썬 내에서는 주로 복잡한 객체를 다루기 때문에, 대부분의 경우 `copy.deepcopy()`가 필요할지를 염두하고 copy를 진행해야된다는 점이다.


## 회고
- `analyze()` 작성 중 `id(origin) == id(clone) ? "True" : "False"` 형태의 C/Java식 삼항 연산자(`? :`)를 그대로 사용해서 `SyntaxError`가 발생함. 파이썬 삼항 표현식은 `참값 if 조건 else 거짓값` 순서로 써야 함 → `("True" if id(origin) == id(clone) else "False")`로 수정.
