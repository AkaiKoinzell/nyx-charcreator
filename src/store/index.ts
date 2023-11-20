import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./auth/auth-slice";
import { guildApi } from "../services/guild";
import { authListenerMiddleware } from "./auth/auth-middleware";
import { authApi } from "../services/auth";
import { characterApi } from "../services/character";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        [guildApi.reducerPath]: guildApi.reducer,
        [authApi.reducerPath]: authApi.reducer,
        [characterApi.reducerPath]: characterApi.reducer
    },
    middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware()
            .prepend(authListenerMiddleware.middleware)
            .concat(guildApi.middleware)
            .concat(authApi.middleware)
            .concat(characterApi.middleware)
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch