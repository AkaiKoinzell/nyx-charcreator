import {
    TypedStartListening,
    createListenerMiddleware,
} from "@reduxjs/toolkit";
import { resetAuthenticationState, setAuthenticationState } from "./auth-slice";
import { AppDispatch, RootState } from "..";
import { getJwtExpirationMillis, getRolesFromJwt, isJwtInvalidOrExpired } from "../../utils/jwt-utils";
import axios, { AxiosResponse } from "axios";
import { JwtResponse } from "../../models/auth/JwtResponse";
import { localStorageJwtKey, localStorageRefreshJwtKey } from "./auth-thunk";

export const authListenerMiddleware = createListenerMiddleware();

type authListeningMiddlewareType = TypedStartListening<RootState, AppDispatch>;

const startAuthListening =
    authListenerMiddleware.startListening as authListeningMiddlewareType;

startAuthListening({
    actionCreator: setAuthenticationState,
    effect: async (action, listenerApi) => {
        listenerApi.cancelActiveListeners();

        const { jwt, refreshJwt } = action.payload;
        const expirationDelay = !!jwt ? getJwtExpirationMillis(jwt) - new Date().getTime() : 0
        // console.log(`Expiration delay ${expirationDelay}`)
        await listenerApi.delay(expirationDelay);

        // console.log(`Refresh ${refreshJwt}`)
        // console.log(`Expired ${!isJwtInvalidOrExpired(refreshJwt!)}`)
        if(!!refreshJwt && !isJwtInvalidOrExpired(refreshJwt)) {
            await axios.post(
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
                    listenerApi.dispatch(setAuthenticationState({ 
                        jwt: response.data.authToken, 
                        refreshJwt: response.data.refreshToken ,
                        roles: getRolesFromJwt(response.data.authToken)
                    }))
                },
                () => {
                    localStorage.removeItem(localStorageJwtKey);
                    localStorage.removeItem(localStorageRefreshJwtKey);
                    listenerApi.dispatch(resetAuthenticationState())
                }
            );
        }
    }
});
