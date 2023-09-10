import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { TokenProvider } from '../utils/TokenProvider'

export const guildApi = createApi({
    reducerPath: 'guildApi',
    baseQuery: fetchBaseQuery({ 
        baseUrl: `${process.env.REACT_APP_KAIRON_API_URL}/guild/`,
        prepareHeaders: async (headers, api) => {
            await TokenProvider.getToken()
        },
    
    }),
    endpoints: (builder) => ({
        getCurrentMembder: builder.query<any, null>({
            query: () => "current/member"
        })
    })
})