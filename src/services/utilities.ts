import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { AuthState } from "../store/auth/auth-slice";
import {ExpTable} from "../models/utils/ExpTable";

export const utilitiesApi = createApi({
	reducerPath: "utilitiesApi",
	baseQuery: fetchBaseQuery({
		baseUrl: `${process.env.REACT_APP_KAIRON_API_URL}/utils`,
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
		getExpTable: build.query<ExpTable, void>({
			query: () => "/expTable",
		}),
	}),
});

export const { useGetExpTableQuery } = utilitiesApi