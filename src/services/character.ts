import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { AuthState } from "../store/auth/auth-slice";
import { Character } from "../models/character/Character";
import { Player } from "../models/player/Player";

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
    keepUnusedDataFor: 300,
    endpoints: (build) => ({
        getCurrentActiveCharacters: build.query<Character<string>[], void>({
            query: () => "current",
            keepUnusedDataFor: 5
        }),
        getAllActiveCharacters: build.query<Character<string>[], void>({
            query: () => "active",
        }),
        getAllActiveCharactersWithPlayer: build.query<Character<Player>[], void>({
            query: () => "active/withPlayer",
        }),
    }),
});

export const {
    useGetCurrentActiveCharactersQuery,
    useGetAllActiveCharactersQuery,
    useGetAllActiveCharactersWithPlayerQuery
} = characterApi;
