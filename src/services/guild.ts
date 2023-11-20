import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { AuthState } from "../store/auth/auth-slice";

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
    endpoints: (builder) => ({
        getCurrentMember: builder.query<any, void>({
            query: () => "current/member",
        }),
    }),
});

export const { useGetCurrentMemberQuery } = guildApi;
