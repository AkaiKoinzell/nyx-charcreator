import {CharacterStatus} from "./CharacterStatus";

export type Errata = {
    ms: number;
    description: string;
    date: number;
    statusChange: CharacterStatus | null;
}