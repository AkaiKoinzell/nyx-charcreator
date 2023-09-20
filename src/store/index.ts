import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./auth/auth-slice";
import { guildApi } from "../services/guild";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        [guildApi.reducerPath]: guildApi.reducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(guildApi.middleware)

})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch