import { Building } from "./Building";
import { Errata } from "./Errata";
import { Proficiency } from "./Proficiency";

export interface Character {
    id: string;
    name: string;
    player: string;
    race: string;
    territory: string;
    class: string;
    status: string;
    masterMS: number;
    PBCMS: number;
    errataMS: number;
    sessionMS: number;
    errata: Errata[];
    created: number;
    lastPlayed: number;
    lastMastered: number | null;
    age: number;
    buildings: {
        [key: string]: Building[];
    };
    inventory: { [key: string]: number };
    languages: Proficiency[];
    money: number;
    proficiencies: Proficiency[];
}

export const exp = (c: Character) => c.masterMS + c.PBCMS + c.errataMS + c.sessionMS