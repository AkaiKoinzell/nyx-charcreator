export function round(num: number): number {
	return (num % 1) < 0.5 ? Math.floor(num) : Math.ceil(num);
}