import {Item} from "../item/Item";

export interface ItemUpdateDto {
	originalName: string
	item: Item
}