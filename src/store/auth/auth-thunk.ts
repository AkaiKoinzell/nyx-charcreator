import { createAsyncThunk } from "@reduxjs/toolkit";
import { AuthState, setAuthenticationState } from "./auth-slice";
import { getRolesFromJwt } from "../../utils/jwt-utils";

export const localStorageJwtKey = "jwt"
export const localStorageRefreshJwtKey = "refreshJwt"

export const getToken = createAsyncThunk(
    'auth/token',
    async (_param: void, { getState, dispatch } ) => {
        const {
            auth: { jwt }
        } = getState() as { auth: AuthState }
        console.log(`JWT: ${jwt}`)
        if(!jwt) {
            // console.log("Load")
            const loadedJwt = localStorage.getItem(localStorageJwtKey)
            const refreshJwt = localStorage.getItem(localStorageRefreshJwtKey)
            const data = { jwt: loadedJwt, refreshJwt, roles: getRolesFromJwt(loadedJwt) }
            if(!!loadedJwt) {
                // console.log(`Loaded: ${loadedJwt}`)
                dispatch(setAuthenticationState(data))
            }
            return data
        }
        
    }
)