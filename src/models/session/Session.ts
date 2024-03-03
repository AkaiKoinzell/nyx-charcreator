import { LabelStub } from "../label/LabelStub";
import { CharacterUpdate } from "./CharacterUpdate";

export interface Session<R> {
    id: string;
    master: string;
    date: number;
    title: string;
    characters: CharacterUpdate[];
    uid: number,
    labels: LabelStub[];
    registeredBy?: R;
}