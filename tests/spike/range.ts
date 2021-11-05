const range = (beginInclusive: number, endInclusive: number) => {
	if (beginInclusive > endInclusive) {
		return [];
	}
	if (beginInclusive === endInclusive) {
		return [beginInclusive];
	}
	const length = (endInclusive - beginInclusive) + 1;
	return Array.from({ length }, (_, i) => beginInclusive + i);
};

console.log(range(1, 5));
console.log(range(3, 8));
console.log(range(0, 9));
console.log(range(-7, 2));
console.log(range(9, 2));
console.log(range(6, 6));
