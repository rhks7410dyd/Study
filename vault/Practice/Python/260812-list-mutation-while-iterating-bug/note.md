# 연습 — 순회 중 리스트 변경 버그 찾기

- 문제: `problem.py`의 `remove_expired`가 `expired=True`인 아이템을 모두 제거해야 하는데, 일부만 제거된다.
- 유형: 디버깅 (에러 없이 조용히 틀린 값이 나오는 케이스 — closure/rate-limiter 예제와 같은 계열)

## 재현
```python
cart = [
    {"name": "apple", "expired": True},
    {"name": "banana", "expired": True},
    {"name": "cherry", "expired": False},
]
remaining = remove_expired(cart)
print("remaining:", [i["name"] for i in remaining])
# 기대: remaining: ['cherry']
# 실제: ?
```
직접 `python problem.py`로 실행해서 실제 출력을 확인해보세요.

## 진행 방법
[[Concepts/디버깅-루틴|디버깅 루틴]]을 따라 아래 순서로 풀어보세요. AI 도구 없이 먼저 시도할 것.

1. 재현 — 실제로 어떤 아이템이 남는지 확인 (기대와 다른 게 있는지)
2. 가설 — `for item in items: items.remove(item)`처럼 순회 중인 리스트를 직접 수정하면 왜 일부 원소를 건너뛰게 되는지 문장으로 적기
3. 검증 — 가설대로 수정 후 재실행해서 `['cherry']`만 남는지 확인

## 접근
### 재현
실제 실행시 출력 결과
```bash
> python ./problem.py
remaining: ['banana','cherry']
```

### 가설
`for item in items` 라인이 무제라고 가정하고 `problem.py`를 아래와 같이 수정후 실행
```python
    for item in items:
        print(item["name"],item["expired"])
```
```bash
> python ./problem.py
apple True
cherry False
remaining: ['banana','cherry']
```
위의 결과를 통해 파악할 수 있는 점은 두번째 결과가 스킵되었다는 것이다.
이는 각 item을 순회하는게 아니라 첫번째 인스턴스, 두번째 인스턴스 이런식으로 순회를 하기 때문이라고 가정함.
따라서 가장 첫번째 것을 삭제해버리면, 그 다음 인스턴스의 포인터가 첫번째가 되기에 자연스럽게 스킵되는 문제가 발생한다고 가정.

### 검증
`reversed()` 메서드를 사용해서 간단하게 맨 뒤부터 삭제하도록 함 (이렇게하면 삭제되더라도 앞의 순서 이동이 없기에 상관이 없음)

#### 변경 코드
```python
def remove_expired(items):
    for item in reversed(items):
        if item["expired"]:
            items.remove(item)
    return items
```
`reversed()` 메서드를 이용해서 리스트의 뒤부터 참조하게 해서 간단하게 수정함.



## 관련 개념
- [[Concepts/디버깅-루틴|디버깅 루틴]]
- [[Concepts/설명-능력|설명 능력]] — 리스트가 인덱스 기반으로 순회된다는 사실이 왜 이 버그의 원인인지 한 문장으로 설명해볼 것
- [[Language/Python/리스트-순회중-변경|순회 중인 리스트를 직접 변경하기 (Python)]]

## 회고
### 개선 코드 문제점
현재 구조대로라면 O(n)이긴하지만 하나 하나에 대하여 `reversed()`된 아이템들에 대해서 앞으로 하나씩 당기는 처리가 필요하기 때문에 최악의 경우 더 느림.

파이썬의 구조상 list 내에는 pointer만 저장되기 때문에, (딕셔너리 자체 아이템이 아닌)
새로운 list를 만들어서 해당 리스트에 정답인 것만 저장하는 방식이 더 빠름.

### Claude 추천 정석 코드
```python
def remove_expired(items):
    return [item for item in items if not item["expired"]]
```
이러한 방식으로 O(n)의 시간동안 그냥 파악만하고 새 리스트를 만드는게 어차피 포인터만 참조하니 실제 메모리 사용량 걱정 X, 시간상 빠름으로 적절함.


### 최선의 코드
list comprehension으로 새로운 리스트를 만들지 않아도 된다면 (이후 원본 리스트를 다시 쓸일이 없다면)
아래의 결과가 메모리도 리스트를 이중으로 만들지 않아도 되고 가장 베스트라고 할 수 있음.

```python
def remove_expired(items):
    write = 0
    for item in items:
        if not item["expired"]:
            items[write] = item
            write += 1
    del items[write:]
    return items
```
