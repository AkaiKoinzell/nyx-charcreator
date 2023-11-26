import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { AuthState } from "../store/auth/auth-slice";
import { GuildMember } from "../models/user/GuildMember";

export const guildApi = createApi({
    reducerPath: "guildApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${process.env.REACT_APP_KAIRON_API_URL}/guild/`,
        prepareHeaders: async (headers, api) => {
            const {
                auth: { jwt },
            } = api.getState() as { auth: AuthState };
            headers.set("Authorization", `Bearer ${jwt}`);
            headers.set("Access-Control-Allow-Origin", "*");
        },
    }),
    keepUnusedDataFor: 300,
    endpoints: (builder) => ({
        getCurrentMember: builder.query<GuildMember, void>({
            query: () => "current/member",
        }),
    }),
});

export const { useGetCurrentMemberQuery } = guildApi;
