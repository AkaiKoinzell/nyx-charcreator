import {FetchBaseQueryError, createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {AuthState} from "../store/auth/auth-slice";
import {Character} from "../models/character/Character";
import {Player} from "../models/player/Player";
import {StatusResponse} from "../models/response/StatusResponse";
import {AddErrataDto} from "../models/character/errata/AddErrataDto";
import {AllCharactersTag, CharactersTagType, CurrentCharactersTag, TokenTagType} from "./tags";
import { UpdateInventoryDto } from "../models/character/UpdateInventoryDto";
import { CharacterToken } from "../models/character/sheet/CharacterToken";
import { UpdateTokenDto } from "../models/dto/UpdateTokenDto";
import { QueryReturnValue } from "@reduxjs/toolkit/dist/query/baseQueryTypes";

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
    tagTypes: [CharactersTagType, TokenTagType],
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
        }),
        getCharacterToken: build.query<CharacterToken | null, string>({
            queryFn: async (characterId: string, queryApi, extraOptions, baseQuery) => {
                const result = await baseQuery(`/${characterId}/token`);
                if(!!result.error && 'status' in result.error && result.error.status === 404) {
                    return { data: null, error: undefined } as QueryReturnValue<CharacterToken | null, FetchBaseQueryError>;
                } else if(!!result.error) {
                    return {
                        error: { 
                        status: result.meta?.response?.status, 
                        data: "An error occurred"
                    } } as QueryReturnValue<CharacterToken | null, FetchBaseQueryError>;
                }
                return result as QueryReturnValue<CharacterToken, FetchBaseQueryError>
            },
            providesTags: (_response, _error, id) => [{ type: TokenTagType, id }]
        }),
        updateCharacterToken: build.mutation<StatusResponse, UpdateTokenDto>({
            query: (payload: UpdateTokenDto) => {
                const bodyFormData = new FormData();
                bodyFormData.append('file', payload.token)
                return {  
                    url: `/${payload.characterId}/token`,
                    method: "POST",
                    body: bodyFormData,
                    headers: {
                        "Access-Control-Allow-Origin": "*"
                    },
                }
            },
            invalidatesTags: (_response, _error, payload) => [{ type: TokenTagType, id: payload.characterId }]
        }),
    }),
});

export const {
    useAddErrataMutation,
    useGetAllActiveCharactersQuery,
    useGetAllActiveCharactersWithPlayerQuery,
    useGetCharacterByIdQuery,
    useGetCharacterTokenQuery,
    useGetCurrentActiveCharactersQuery,
    useUpdateCharacterTokenMutation,
    useUpdateInventoryMutation
} = characterApi;
