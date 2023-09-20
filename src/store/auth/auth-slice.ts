import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "..";
import { getToken } from "./auth-thunk";

export interface AuthState { 
    jwt: string | null;
    refreshJwt: string | null;
}

const initialState: AuthState = {
    jwt: null,
    refreshJwt: null
}

const authSlice = createSlice({
    name: "auth",
    initialState: initialState,
    reducers: {
        setAuthenticationState: (state, action: PayloadAction<AuthState>) => {
            state.jwt = action.payload.jwt
            state.refreshJwt = action.payload.refreshJwt
        },
        resetAuthenticationState: (state) => {
            state.jwt = null
            state.refreshJwt = null
        }
    },
    extraReducers: builder => {
        builder.addCase(getToken.fulfilled, (state,  { payload }) => {
            state.jwt = payload.authToken
            state.refreshJwt = payload.refreshToken
        })
        builder.addCase(getToken.rejected, (state) => {
            state.jwt = null
            state.refreshJwt = null
        })
    }
})

export const { setAuthenticationState, resetAuthenticationState } = authSlice.actions

export const authReducer = authSlice.reducer

export const jwtSelector = (state: RootState) => state.auth.jwt
export const refreshJwtSelector = (state: RootState) => state.auth.refreshJwt