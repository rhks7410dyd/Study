# 관련: 디버깅-루틴.md

def remove_expired(items):
    """장바구니 아이템 중 expired=True인 것들을 제거하고 남은 목록을 반환한다."""
    for item in reversed(items):
        if item["expired"]:
            items.remove(item)
    return items


def demo():
    cart = [
        {"name": "apple", "expired": True},
        {"name": "banana", "expired": True},
        {"name": "cherry", "expired": False},
    ]
    remaining = remove_expired(cart)
    print("remaining:", [i["name"] for i in remaining])
    # 기대: remaining: ['cherry']


if __name__ == "__main__":
    demo()
