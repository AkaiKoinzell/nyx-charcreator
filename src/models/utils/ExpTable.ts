export interface ExpTable {
	table: { [key: number]: string }
}

export function expToLevel(expTable: ExpTable | undefined, exp: number): string | undefined {
	if (expTable == null) return undefined;
	const keys: number[] = Object.keys(expTable.table).map(Number).sort((a, b) => a - b);
	const previousKey = keys.find((key, index) => key <= exp && (index >= keys.length - 1 || keys[index + 1] > exp)) ?? keys[keys.length - 1];
	return expTable.table[previousKey];
}