import { createAsyncThunk } from "@reduxjs/toolkit";
import { AuthState, resetAuthenticationState, setAuthenticationState, setDiscordCode } from "./auth-slice";
import axios from "axios";
import { JwtResponse } from "../../models/auth/JwtResponse";

export const localStorageJwtKey = "jwt"
export const localStorageRefreshJwtKey = "refreshJwt"

export const getToken = createAsyncThunk(
    'auth/token',
    async (_param: void, { getState, dispatch } ) => {
        const {
            auth: { jwt }
        } = getState() as { auth: AuthState }

        if(!jwt) {
            const loadedJwt = localStorage.getItem(localStorageJwtKey)
            const refreshJwt = localStorage.getItem(localStorageRefreshJwtKey)
            const data = { jwt: loadedJwt, refreshJwt }
            if(!!loadedJwt) {
                dispatch(setAuthenticationState(data))
            }
            return data
        }
        
    }
)