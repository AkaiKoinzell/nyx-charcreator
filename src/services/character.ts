import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {AuthState} from "../store/auth/auth-slice";
import {Character} from "../models/character/Character";
import {Player} from "../models/player/Player";
import {StatusResponse} from "../models/response/StatusResponse";
import {AddErrataDto} from "../models/character/errata/AddErrataDto";
import {AllCharactersTag, CharactersTagType, CurrentCharactersTag} from "./tags";
import { UpdateInventoryDto } from "../models/character/UpdateInventoryDto";

export const characterApi = createApi({
    reducerPath: "characterApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${process.env.REACT_APP_KAIRON_API_URL}/character/`,
        mode: "cors",
        prepareHeaders: async (headers, api) => {
            const {
                auth: { jwt },
            } = api.getState() as { auth: AuthState };
            headers.set("Authorization", `Bearer ${jwt}`);
            headers.set("Access-Control-Allow-Origin", "*");
        },
    }),
    tagTypes: [CharactersTagType],
    endpoints: (build) => ({
        addErrata: build.mutation<StatusResponse, AddErrataDto>({
            query: (args: AddErrataDto) => ({
                url: `${args.characterId}/errata`,
                method: "POST",
                body: JSON.stringify(args.errata),
                headers: {
                    "Content-type": "application/json",
                    "Access-Control-Allow-Origin": "*"
                },
            }),
            invalidatesTags: [AllCharactersTag]
        }),
        getCurrentActiveCharacters: build.query<Character<string>[], void>({
            query: () => "current",
            providesTags: [CurrentCharactersTag]
        }),
        getAllActiveCharacters: build.query<Character<string>[], void>({
            query: () => "active",
            providesTags: [AllCharactersTag]
        }),
        getAllActiveCharactersWithPlayer: build.query<Character<Player>[], void>({
            query: () => "active/withPlayer",
            providesTags: [AllCharactersTag]
        }),
        getCharacterById: build.query<Character<string>, string>({
            query: (characterId: string) => `${characterId}`,
            providesTags: (character) =>
                !!character ? [{ type: CharactersTagType, id: character.id }, AllCharactersTag] : [AllCharactersTag]
        }),
        updateInventory: build.mutation<StatusResponse, UpdateInventoryDto>({
            query: (payload: UpdateInventoryDto) => ({
                url: `/${payload.characterId}/inventory`,
                method: "POST",
                body: JSON.stringify({itemId: payload.itemId, qty: payload.qty, operation: payload.operation}),
                headers: {
                    "Content-type": "application/json",
                    "Access-Control-Allow-Origin": "*"
                },
            }),
            invalidatesTags: (_response, _error, payload) => [{ type: CharactersTagType, id: payload.characterId }]
        })
    }),
});

export const {
    useAddErrataMutation,
    useGetCurrentActiveCharactersQuery,
    useGetAllActiveCharactersQuery,
    useGetAllActiveCharactersWithPlayerQuery,
    useGetCharacterByIdQuery,
    useUpdateInventoryMutation
} = characterApi;
