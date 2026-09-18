## `mutable` & `immutable`
파이썬의 객체는 `mutable` 과 `immutable` 로 나뉜다.
### `immutable` 
`immutable` 한 객체는 한 번 생성되면 그 내용을 바꿀 수 없는 객체를 의미한다. 대부분의 내장 타입은 `immutable` 하다고 판단하면되는데, 내장 타입 정리하자면 다음과 같다.

|                 타입                 | 예시                   |
| :--------------------------------: | :------------------- |
|      `int`,`float`,`complex`       | `1`, `3.14`          |
|               `bool`               | `True`,`False`       |
|               `str`                | `"ABC"`              |
|              `tuple`               | `(1,2,3)`            |
|            `frozenset`             | `frozenset({1,2,3})` |
|              `bytes`               | `b"abc"`             |
|              `range`               | `range(10)`          |
|             `NoneType`             | `None`               |
| `Decimal`,`Fraction` (표준 라이브러리 기준) |                      |

여기서 C를 기초로 하여 언어를 공부한 입장에서는, `int`, `bool`, `float` 과 같은 타입의 값이 변경되는데 왜 `immutable` 이라고 하는지 파악이 어려울 수 있다.

```Python
int a = 3 #선언할 때 값이 고정된다면
a = 2 #해당 부분에서는 어떻게 값이 바뀌는가?
```

위와 같은 예시에서 중간에 id를 추적해보면, 왜 `immutable` 한지를 알 수 있게 된다.

```Python
a = 3
print(hex(id(a))) 
a = 2 
print(hex(id(a)))
```

위의 예시를 실제로 실행해보았을 때 결과는 아래와 같다.

```bash
> python ./mutable-default-argument
a의 타입 :  <class 'int'>
0x7fff409e23e8
0x7fff409e23c8
```

보는 것과 같이 메모리 주소가 변경되는데, 이것과 같이 `immutabale`한 타입을 변수에 선언할 경우, 값이 변경되면 **객체 자체를 새롭게 생성해서 대입되는 것이지, 메모리 주소내 값이 변경되는게 아님을 알 수 있다.**


### `mutable`
`mutable`한 타입은 새로운 변수가 생성되지 않고 해당 변수가 변경될 수 있는 타입을 의미하는데, 자세한 내장 타입은 아래와같다.

|        타입        | 예시                  |
| :--------------: | :------------------ |
|      `list`      | `[1,2,3]`           |
|      `dict`      | `{"a":1}`           |
|      `set`       | `{1,2,3}`           |
|   `bytearray`    | `bytearray(b"abc")` |
| 사용자 정의 클래스 (기본값) | `class custom: ...` |
해당 객체들은 내부 값이 변경 되더라도, 새로운 객체를 생성하는 것이 아니라, 내부에 있는 원소들의 대상 객체 주소가 변경되는 종류들이라고 할 수 있다

### `tuple`의 얕은 불변성
`tuple`의 경우에는 `immutable`한 타입에 포함되어 있지만, 이는 약간의 

#### `tuple`의 얕은 복사
`tuple` 의 경우 조금 다르게 "얕게만" 불변인 타입으로서, 다르게 파악해야한다.
아래의 예시와 같이, `tuple`은 내부 원소 자체를 변경할 수는 없지만, **해당 원소가 `mutable`인 경우에는 해당 원소 내부 값은 변경될 수 있다.**

```Python
t = ([1,2],"hi")
t[0] = [9,9]
```

```bash
> python ./mutable-default-argument-tuple-1.py
Traceback (most recent call last):
  File "C:\personal\AI-Pair-Programming\vault\Language\Python\mutable-default-argument-tuple-1.py", line 2, in <module>
    t[0] = [9,9]
    ~^^^
TypeError: 'tuple' object does not support item assignment
```

```Python
t = ([1,2],"hi")
t[0][0] = 5
print(t)
t[0].append(3)
print(t)
```

```bash
> python ./mutable-default-argument-tuple-2.py
([5, 2], 'hi')
([5, 2, 3], 'hi')
```