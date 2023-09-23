import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { JwtResponse } from "../models/auth/JwtResponse";

export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${process.env.REACT_APP_KAIRON_API_URL}`,
        prepareHeaders: (headers) => {
            headers.set("Content-Type", "application/json");
        },
    }),
    endpoints: (builder) => ({
        discordLogin: builder.mutation<JwtResponse, string>({
            query: (code) => ({
                url: `/login/discord`,
                method: "POST",
                body: JSON.stringify({ code }),
                headers: { "Content-type": "application/json" },
            }),
        }),
    }),
});

export const { useDiscordLoginMutation } = authApi