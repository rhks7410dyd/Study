class ShoppingCart:
    """장바구니에 아이템을 담는 클래스.
    add_item으로 아이템을 담고, items로 확인한다.
    """

    def __init__(self, name, items=[]):
        self.name = name
        self.items = items

    def add_item(self, item):
        self.items.append(item)


def demo():
    cart_a = ShoppingCart("A",list())
    cart_a.add_item("apple")

    cart_b = ShoppingCart("B",list())
    cart_b.add_item("banana")

    print(cart_a.name, cart_a.items)
    print(cart_b.name, cart_b.items)


if __name__ == "__main__":
    demo()
