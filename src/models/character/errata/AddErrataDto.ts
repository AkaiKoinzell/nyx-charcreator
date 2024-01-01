import {Errata} from "../Errata";

export type AddErrataDto = {
    characterId: string;
    errata: Errata;
}