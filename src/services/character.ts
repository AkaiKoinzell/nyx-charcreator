import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { AuthState } from "../store/auth/auth-slice";
import { Character } from "../models/character/Character";
import { Player } from "../models/player/Player";
import {StatusResponse} from "../models/response/StatusResponse";
import {Errata} from "../models/character/Errata";
import {AddErrataDto} from "../models/character/errata/AddErrataDto";
import {BaseQueryArg} from "@reduxjs/toolkit/dist/query/baseQueryTypes";
import {CharactersTag, CurrentCharactersTag} from "./tags";

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
    tagTypes: [CurrentCharactersTag, CharactersTag],
    keepUnusedDataFor: 300,
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
            invalidatesTags: [CharactersTag]
        }),
        getCurrentActiveCharacters: build.query<Character<string>[], void>({
            query: () => "current",
            keepUnusedDataFor: 5,
            providesTags: [CurrentCharactersTag]
        }),
        getAllActiveCharacters: build.query<Character<string>[], void>({
            query: () => "active",
            providesTags: [CharactersTag]
        }),
        getAllActiveCharactersWithPlayer: build.query<Character<Player>[], void>({
            query: () => "active/withPlayer",
            providesTags: [CharactersTag]
        }),
    }),
});

export const {
    useAddErrataMutation,
    useGetCurrentActiveCharactersQuery,
    useGetAllActiveCharactersQuery,
    useGetAllActiveCharactersWithPlayerQuery
} = characterApi;
