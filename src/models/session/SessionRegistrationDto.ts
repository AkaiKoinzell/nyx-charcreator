import { LabelStub } from "../label/LabelStub";
import { SessionOutcome } from "./SessionOutcome";

export interface SessionRegistrationDto {
    masterId: string;
    masterReward: number;
    title: string;
    date: number;
    outcomes: SessionOutcome[];
    labels: LabelStub[];
}