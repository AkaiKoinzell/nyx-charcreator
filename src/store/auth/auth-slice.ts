import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "..";
import { getRolesFromJwt, Roles } from "../../utils/jwt-utils";

export interface AuthState {
    discordCode?: string | null;
    jwt: string | null;
    refreshJwt: string | null;
    roles: Roles[];
}

const initialState: AuthState = {
    jwt: null,
    refreshJwt: null,
    roles: []
};

const authSlice = createSlice({
    name: "auth",
    initialState: initialState,
    reducers: {
        setDiscordCode: (state, action: PayloadAction<string | null>) => {
            if (!!action.payload) {
                state.discordCode = action.payload;
            }
        },
        setAuthenticationState: (state, action: PayloadAction<AuthState>) => {
            state.jwt = action.payload.jwt;
            state.refreshJwt = action.payload.refreshJwt;
            state.roles = getRolesFromJwt(action.payload.jwt)
        },
        resetAuthenticationState: (state) => {
            state.jwt = null;
            state.refreshJwt = null;
        }
    }
});

export const {
    setDiscordCode,
    setAuthenticationState,
    resetAuthenticationState,
} = authSlice.actions;

export const authReducer = authSlice.reducer;

export const jwtSelector = (state: RootState) => state.auth.jwt;
export const refreshJwtSelector = (state: RootState) => state.auth.refreshJwt;
export const roleSelector = (state: RootState) => state.auth.roles;
export const discordCodeSelector = (state: RootState) => state.auth.discordCode;
