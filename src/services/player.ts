import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { AuthState } from "../store/auth/auth-slice";
import {Player} from "../models/player/Player";

export const playerApi = createApi({
	reducerPath: "playerApi",
	baseQuery: fetchBaseQuery({
		baseUrl: `${process.env.REACT_APP_KAIRON_API_URL}/player`,
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
		getPlayers: build.query<Player[], string[]>({
			query: (playerIds) => ({
				url: `/byIds`,
				method: "POST",
				body: JSON.stringify(playerIds),
				headers: {
					"Content-type": "application/json",
					"Access-Control-Allow-Origin": "*"
				}
			}),
		}),
	}),
});

export const { useGetPlayersQuery } = playerApi