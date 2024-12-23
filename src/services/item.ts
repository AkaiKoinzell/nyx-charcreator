import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/dist/query/react";
import {AuthState} from "../store/auth/auth-slice";
import {Item} from "../models/item/Item";
import {AllItemsTag, ItemsTagType, MaterialsTagType} from "./tags";
import {ListOfIds} from "../models/response/ListOfIds";
import { PaginatedList } from "../models/response/PaginatedList";
import { SearchItemsParams } from "../models/request/SearchItemsParams";
import {ItemUpdateDto} from "../models/dto/ItemUpdateDto";
import {ManualSource} from "../models/item/ManualSource";
import {LabelStub} from "../models/label/LabelStub";

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
	tagTypes: [ItemsTagType, MaterialsTagType],
	endpoints: (build) => ({
		getItems: build.query<Item[], null>({
			query: () => "",
			providesTags: [AllItemsTag]
		}),
		getItemsByIds: build.query<Item[], string[]>({
			query: (ids: string[]) => ({
				url: "/byIds",
				method: "POST",
				body: JSON.stringify({ ids }),
				headers: { "Content-type": "application/json" }
			}),
			providesTags: (items) =>
				!!items ? [AllItemsTag, ...(items.map(it => ({ type: 'Item' as const, id: it.name})))] : [AllItemsTag]
		}),
		getMaterialsBy: build.query<ListOfIds, string>({
			query: (id: string) => `/materialsBy/${id}`,
			providesTags: (_response, _error, id) => [{ type: MaterialsTagType, id}]
		}),
		listItemIds: build.query<string[], {query?: string; labels?: LabelStub[]}>({
			query: (params: {query?: string; labels?: LabelStub[]}) => ({
				url: `/ids?ts=${new Date().getTime()}${!!params.query ? `&query=${params.query}` : ""}`,
				method: "POST",
				body: JSON.stringify(params.labels ?? null),
				headers: { "Content-type": "application/json" }
			}),
			providesTags: [AllItemsTag]
		}),
		searchItems: build.query<PaginatedList<Item>, SearchItemsParams>({
			query: (params: SearchItemsParams) => ({
				url: `/search?ts=${new Date().getTime()}${!!params.limit ? `&limit=${params.limit}`: ''}${!!params.nextAt ? `&nextAt=${params.nextAt}`: ''}`
					+ (!!params.query ? `&query=${params.query}` : ""),
				method: "POST",
				body: JSON.stringify(params.label ?? null),
				headers: { "Content-type": "application/json" }
			}),
			providesTags: [AllItemsTag]
		}),
		createItem: build.mutation<void, Item>({
			query: (payload: Item) => ({
				url: "",
				method: "POST",
				body: JSON.stringify(payload),
				headers: {
					"Content-type": "application/json",
					"Access-Control-Allow-Origin": "*"
				},
			}),
			invalidatesTags: (_response, _error, payload) => [AllItemsTag]
		}),
		deleteItem: build.mutation<void, string>({
			query: (payload: string) => ({
				url: `/${payload}`,
				method: "DELETE",
			}),
			invalidatesTags: (_response, _error, payload) => [AllItemsTag]
		}),
		updateItem: build.mutation<void, ItemUpdateDto>({
			query: (payload: ItemUpdateDto) => ({
				url: "",
				method: "PUT",
				body: JSON.stringify(payload),
				headers: {
					"Content-type": "application/json",
					"Access-Control-Allow-Origin": "*"
				},
			}),
			invalidatesTags: (_response, _error, payload) => [AllItemsTag]
		}),
		getSources: build.query<ManualSource[], void>({
			query: () => "/sources",
			providesTags: [AllItemsTag]
		}),
	}),
});

export const {
	useCreateItemMutation,
	useDeleteItemMutation,
	useGetItemsQuery,
	useGetSourcesQuery,
	useGetItemsByIdsQuery,
	useLazyGetMaterialsByQuery,
	useLazyListItemIdsQuery,
	useSearchItemsQuery,
	useUpdateItemMutation
} = itemApi

export const useItemsPrefetch = itemApi.usePrefetch;

export type ItemApiEndpoints = keyof typeof itemApi