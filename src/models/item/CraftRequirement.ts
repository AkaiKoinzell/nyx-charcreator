export interface CraftRequirement {
    timeRequired: number | null;
    minQuantity: number | null;
    maxQuantity: number | null;
    materials: { [key: string]: number};
    label: string | null;
    cost: number;
    buildings: string[];
    tools: string[];
}