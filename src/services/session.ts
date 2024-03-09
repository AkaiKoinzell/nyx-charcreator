import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { AuthState } from "../store/auth/auth-slice";
import { SessionRegistrationDto } from "../models/session/SessionRegistrationDto";
import { StatusResponse } from "../models/response/StatusResponse";
import { AllSessionsTag, SessionsCountTag, SessionsTagType } from "./tags";
import { PaginatedList } from "../models/response/PaginatedList";
import { PaginatedRequestParams } from "../models/request/PaginatedRequestParams";
import { Session } from "../models/session/Session";
import { Player } from "../models/player/Player";
import { CountDto } from "../models/dto/CountDto";

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
    tagTypes: [SessionsTagType],
    endpoints: (build) => ({
        registerSession: build.mutation<StatusResponse, SessionRegistrationDto>({
            query: (sessionRegistrationDto: SessionRegistrationDto) => ({
                url: ``,
                method: "POST",
                body: JSON.stringify(sessionRegistrationDto),
                headers: {
                     "Content-type": "application/json",
                     "Access-Control-Allow-Origin": "*"
                }
            }),
            invalidatesTags: [AllSessionsTag, SessionsCountTag]
        }),
        getSessionsCount: build.query<CountDto, void>({
            query: () => `/count`,
            providesTags: [SessionsCountTag]
        }),
        getPaginatedSessions: build.query<PaginatedList<Session<Player>>, PaginatedRequestParams>({
            query: (params: PaginatedRequestParams) => 
                `?ts=${new Date().getTime()}${!!params.limit ? `&limit=${params.limit}`: ''}${!!params.nextAt ? `&nextAt=${params.nextAt}`: ''}`,
            providesTags: [AllSessionsTag]
        }),
        deleteSession: build.mutation<StatusResponse, string>({
            query: (sessionId: string) => ({
                url: `/${sessionId}?masterReward=1`,
                method: "DELETE"
            }),
            invalidatesTags: [AllSessionsTag, SessionsCountTag]
        })
    }),
});

export const { 
    useDeleteSessionMutation,
    useGetPaginatedSessionsQuery,
    useGetSessionsCountQuery,
    useRegisterSessionMutation
} = sessionApi;