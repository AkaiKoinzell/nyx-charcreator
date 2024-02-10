export interface UpdateInventoryDto {
	itemId: string;
	qty: number,
	characterId: string;
	operation: UpdateInventoryOperation;
}

export enum UpdateInventoryOperation { 
	BUY = "BUY", 
	SELL = "SELL", 
	ASSIGN = "ASSIGN", 
	TAKE = "TAKE" 
}