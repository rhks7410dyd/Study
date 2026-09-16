# 관련: 디버깅-루틴.md

def clone_board(board):
    """2D 보드(리스트의 리스트)를 복제해서 원본에 영향 없는 새 보드를 반환한다."""
    return board.copy()

def demo():
    original = [[0, 0, 0], [0, 0, 0]]
    clone = clone_board(original)

    clone[0][0] = 9

    print("original:", original)
    print("clone:", clone)
    analyze(original,clone)


def analyze(origin,clone):
    print("전체 리스트의 객체 id가 동일한가? : " + ("True" if id(origin) == id(clone) else "False"))
    print("하위 첫 리스트의 객체 id가 동일한가? : " + ("True" if id(origin[0]) == id(clone[0]) else "False"))
    print("하위 두 번째  리스트의 객체 id가 동일한가? : " + ("True" if id(origin[1]) == id(clone[1]) else "False"))


if __name__ == "__main__":
    demo()

