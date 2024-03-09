import { LabelStub } from "../label/LabelStub";
import { PaginatedRequestParams } from "./PaginatedRequestParams";

export interface SearchItemsParams extends PaginatedRequestParams {
    query?: string;
    label?: LabelStub;
}