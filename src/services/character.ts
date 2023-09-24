import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { AuthState } from "../store/auth/auth-slice";
import { Character } from "../models/character/Character";

export const characterApi = createApi({
    reducerPath: "characterApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${process.env.REACT_APP_KAIRON_API_URL}/characters/`,
        prepareHeaders: async (headers, api) => {
            const {
                auth: { jwt },
            } = api.getState() as { auth: AuthState };
            headers.set("Authorization", `Bearer ${jwt}`);
        },
    }),
    endpoints: (build) => ({
        getCurrentActiveCharacters: build.query<Character[], void>({
            query: () => "current",
        }),
    }),
});

export const { useGetCurrentActiveCharactersQuery } = characterApi

