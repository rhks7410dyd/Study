def append_to(element, arr=[]):
	arr.append(element)
	return arr
	
if __name__ == "__main__":
	print(append_to(12))
	
	print(append_to(42))
	
	print(append_to(99))
	
	print(append_to(0,[1,1,1,]))
