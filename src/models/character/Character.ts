import { LabelStub } from "../label/LabelStub";
import { Building } from "./Building";
import { Errata } from "./Errata";
import { Proficiency } from "./Proficiency";

export interface Character<P> {
    id: string;
    name: string;
    race: string;
    player: P;
    territory: string;
    characterClass: string[];
    status: string;
    masterMS: number;
    pbcMS: number;
    errataMS: number;
    sessionMS: number;
    errata: Errata[];
    created: number;
    lastPlayed: number | null;
    lastMastered: number | null;
    age: number;
    buildings: {
        [key: string]: Building[];
    };
    inventory: { [key: string]: number };
    languages: Proficiency[];
    money: number;
    proficiencies: Proficiency[];
    labels: LabelStub[];
}

export const exp = (c: Character<any>) => c.masterMS + c.pbcMS + c.errataMS + c.sessionMS