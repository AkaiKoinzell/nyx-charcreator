import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/dist/query/react";
import {AuthState} from "../store/auth/auth-slice";
import {Item} from "../models/item/Item";
import {AllCharactersTag, AllItemsTag, CharactersTagType, ItemsTagType, MaterialsTagType} from "./tags";
import {ListOfIds} from "../models/response/ListOfIds";
import { StatusResponse } from "../models/response/StatusResponse";
import { UpdateInventoryDto } from "../models/character/UpdateInventoryDto";

export const itemApi = createApi({
    reducerPath: "itemApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${process.env.REACT_APP_KAIRON_API_URL}/item`,
        mode: "cors",
        prepareHeaders: async (headers, api) => {
            const {
                auth: { jwt },
            } = api.getState() as { auth: AuthState };
            headers.set("Authorization", `Bearer ${jwt}`);
            headers.set("Access-Control-Allow-Origin", "*");
        },
    }),
    tagTypes: [ItemsTagType, MaterialsTagType, CharactersTagType],
    endpoints: (build) => ({
        getItems: build.query<Item[], void>({
            query: () => "",
            providesTags: [AllItemsTag]
        }),
        getItemsByIds: build.query<Item[], string[]>({
            query: (ids: string[]) => ({
                url: "/byIds",
                method: "POST",
                body: JSON.stringify({ ids }),
                headers: {
                    "Content-type": "application/json",
                    "Access-Control-Allow-Origin": "*"
                },
            }),
            providesTags: (items) =>
                !!items ? [AllItemsTag, ...(items.map(it => ({ type: 'Item' as const, id: it.name})))] : [AllItemsTag]
        }),
        getMaterialsBy: build.query<ListOfIds, string>({
            query: (id: string) => `/materialsBy/${id}`,
            providesTags: (_response, _error, id) => [{ type: MaterialsTagType, id}]
        })
    }),
});

export const {
    useGetItemsQuery,
    useGetItemsByIdsQuery,
    useLazyGetMaterialsByQuery
} = itemApi