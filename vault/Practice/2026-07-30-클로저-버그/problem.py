def build_discount_functions(tiers):
    """tiers: [{"name": str, "rate": float}, ...]
    각 등급(tier)마다 그 등급의 할인율을 적용하는 함수를 반환한다.
    """
    funcs = {}
    for tier in tiers:
        funcs[tier["name"]] = lambda price: price * (1 - tier["rate"])
    return funcs


def demo():
    tiers = [
        {"name": "bronze", "rate": 0.05},
        {"name": "silver", "rate": 0.10},
        {"name": "gold", "rate": 0.20},
    ]
    funcs = build_discount_functions(tiers)
    for name in ["bronze", "silver", "gold"]:
        print(name, funcs[name](100))


if __name__ == "__main__":
    demo()
