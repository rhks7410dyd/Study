## 작성 이유
파이썬에서는 function이나 메서드를 선언할 때, 모든 객체가 default value를 선언할 수 있다.

하지만 해당 과정에서 예상치 못한 동작이 발생할 수 있는데, 이 문제는 mutable과 immutable 타입의 차이로 인해 발생한다. 이 부분에 대해 정리하기 위해 해당 설명 글을 작성한다.

## `mutable` 객체에 대해 `default value` 기능을 사용한 경우 
### 예시 파일
```Python
def append_to(element, arr=[]):
	arr.append(element)
	return arr
	
if __name__ == "__main__":
	print(append_to(12))
	
	print(append_to(42))
	
	print(append_to(99))
	
	print(append_to(0,[1,1,1,]))
```

### 설명
위의 예시 코드를 보면, 메서드 `append_to`는 빈 배열을 `default value`로 설정되어 있기 때문에, 해당 코드를 작성한 코더가 기대한 결과는 아래와 같을 것이다.
```bash
> python ./mutable-default-argument-default-value.py
[12]
[42]
[99]
[1,1,1,0]
```

하지만 실제로 실행해본다면, 아래와 같이 결과가 나온다.
```bash
> python ./mutable-default-argument-default-value.py
[12]
[12, 42]
[12, 42, 99]
[1, 1, 1, 0]
```

이것과 최초 3번의 호출은 동일한 배열을 사용하는 것을 알 수 있다.

## 참조
- [Use mutable default value as an argument in Python](https://www.geeksforgeeks.org/python/use-mutable-default-value-as-an-argument-in-python/)
- 파이썬 내장 함수 설명 공식 문서
- 