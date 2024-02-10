import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { AuthState } from "../store/auth/auth-slice";
import { SessionRegistrationDto } from "../models/session/SessionRegistrationDto";
import { StatusResponse } from "../models/response/StatusResponse";

export const sessionApi = createApi({
    reducerPath: "sessionApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${process.env.REACT_APP_KAIRON_API_URL}/session`,
        mode: "cors",
        prepareHeaders: async (headers, api) => {
            const {
                auth: { jwt },
            } = api.getState() as { auth: AuthState };
            headers.set("Authorization", `Bearer ${jwt}`);
            headers.set("Access-Control-Allow-Origin", "*");
        },
    }),
    endpoints: (build) => ({
        registerSession: build.mutation<StatusResponse, SessionRegistrationDto>({
            query: (sessionRegistrationDto: SessionRegistrationDto) => ({
                url: ``,
                method: "POST",
                body: JSON.stringify(sessionRegistrationDto),
                headers: {
                     "Content-type": "application/json",
                     "Access-Control-Allow-Origin": "*"
                },
            }),
        })
    }),
});

export const { useRegisterSessionMutation } = sessionApi;