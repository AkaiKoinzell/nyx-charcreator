import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { TokenProvider } from '../utils/TokenProvider'

export const guildApi = createApi({
    reducerPath: 'guildApi',
    baseQuery: fetchBaseQuery({ 
        baseUrl: `${process.env.REACT_APP_KAIRON_API_URL}/guild/`,
        prepareHeaders: async (headers, api) => {
            const token = await TokenProvider.getToken()
            headers.set("Authorization", `Bearer ${token}`)
            throw Error("Ok")
        },
    
    }),
    endpoints: (builder) => ({
        getCurrentMember: builder.query<any, void>({
            query: () => "current/member"
        })
    })
})

export const { useGetCurrentMemberQuery } = guildApi