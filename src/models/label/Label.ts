import { LabelType } from "./LabelType";

export interface Label {
    id: string,
    name: string,
    description: string | undefined,
    types: LabelType[]
}