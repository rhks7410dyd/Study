# 관련: 디버깅-루틴.md

def sum_and_max(numbers):
    """숫자 모음을 받아 합계와 최댓값을 함께 반환한다."""
    total = sum(numbers)
    highest = max(numbers)
    return total, highest


def demo():
    gen = [n for n in range(1, 6)]
    total, highest = sum_and_max(gen)
    print("total:", total, "highest:", highest)


if __name__ == "__main__":
    demo()
