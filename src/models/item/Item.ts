import {BuySellRequirement} from "./BuySellRequirement";
import {CraftRequirement} from "./CraftRequirement";
import {LabelStub} from "../label/LabelStub";
import { Character } from "../character/Character";

export interface Item {
    name: string;
    sell?: BuySellRequirement | null;
    buy?: BuySellRequirement | null;
    usable: boolean;
    link: string | null;
    manual: string | null;
    attunement: boolean;
    giveRatio: number;
    craft: CraftRequirement[];
    labels: LabelStub[];
}

export function characterCanSell(character: Character<any>, item: Item): number {
    const canSell = !!item.sell 
        && !!character.inventory[item.name] 
        && (!item.sell.tools || item.sell.tools.every(it => character.proficiencies.some( itt => itt.name === it)))
    
    return canSell ? character.inventory[item.name] : 0
}