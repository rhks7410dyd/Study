# 관련: 디버깅-루틴.md

def find_last_index(nums, target):
    # 버그였던 부분: range(len(nums)-1, -1, -1)의 시작을 len(nums)-1로 고쳐
    # 마지막 인덱스부터 검사하도록 수정 (기존엔 len(nums)로 시작해 IndexError 회피용
    # 조건이 꼬여 있었음)
    for i in range(len(nums) - 1, -1, -1):
        if nums[i] == target:
            return i
    return -1


def demo():
    assert find_last_index([1, 2, 3], 3) == 2
    assert find_last_index([1, 2, 3, 2], 2) == 3
    assert find_last_index([1, 2, 3], 9) == -1
    print("ok")


if __name__ == "__main__":
    demo()
