export function chunkArray<T>(array: T[], size: number): T[][] {
	const result: T[][] = []
	for(let i = 0; i < array.length; i += size) {
		result.push(array.slice(i, i+size))
	}
	return result;
}

export function random<T>(array: T[]): T | undefined {
	if (array.length === 0) {
		return undefined;
	}
	const randomIndex = Math.floor(Math.random() * array.length);
	return array[randomIndex];
}