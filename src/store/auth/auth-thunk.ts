import { createAsyncThunk } from "@reduxjs/toolkit";
import { AuthState, setAuthenticationState } from "./auth-slice";
import { getRolesFromJwt, isJwtInvalidOrExpired } from "../../utils/jwt-utils";
import axios, { AxiosResponse } from "axios";
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
            if(!!loadedJwt && !!refreshJwt) {
                if(!isJwtInvalidOrExpired(loadedJwt)) {
                    const data = { jwt: loadedJwt, refreshJwt, roles: getRolesFromJwt(loadedJwt) };
                    dispatch(setAuthenticationState(data))
                    return data;
                } else if(isJwtInvalidOrExpired(loadedJwt) && !isJwtInvalidOrExpired(refreshJwt)) {
                    const data = await axios.post(
                        `${process.env.REACT_APP_KAIRON_API_URL}/auth/refresh`,
                        null,
                        { headers: {
                            "Authorization": `Bearer ${refreshJwt}`,
                            "Access-Control-Allow-Origin": "*"
                        }}
                    ).then( 
                        (response: AxiosResponse<JwtResponse, any>) => {
                            localStorage.setItem(localStorageJwtKey, response.data.authToken);
                            localStorage.setItem(localStorageRefreshJwtKey, response.data.refreshToken);
                            return { 
                                jwt: response.data.authToken, 
                                refreshJwt: response.data.refreshToken, 
                                roles: getRolesFromJwt(response.data.authToken) 
                            };
                        },
                        () => {
                            localStorage.removeItem(localStorageJwtKey);
                            localStorage.removeItem(localStorageRefreshJwtKey);
                            return null;
                        }
                    );
                    if(!!data) {
                        dispatch(setAuthenticationState(data))
                        return data;
                    }
                }
            }
        }
        
    }
)