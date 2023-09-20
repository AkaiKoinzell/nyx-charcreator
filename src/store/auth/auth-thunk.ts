import { createAsyncThunk } from "@reduxjs/toolkit";
import { AuthState } from "./auth-slice";
import axios from "axios";
import { JwtResponse } from "../../models/auth/JwtResponse";
import { isJwtInvalidOrExpired } from "../../utils/jwt-utils";

export const getToken = createAsyncThunk(
    'auth/token',
    async (code: string | undefined, { getState } ) => {
        if(!!code) {
            const response = await axios.post(
                `${process.env.REACT_APP_KAIRON_API_URL}/login/discord`,
                { code },
                { headers: { "Content-Type": "application/json" } }
            );
            if (response.status !== 200) {
                throw new Error()
            } else {
                return response.data as JwtResponse;
            }
        }
        const {
            auth: { jwt, refreshJwt }
        } = getState() as { auth: AuthState }

        if(!!jwt && !isJwtInvalidOrExpired(jwt)) {
            return { authToken: jwt, refreshToken: refreshJwt}
        }

        if(!!refreshJwt && !isJwtInvalidOrExpired(refreshJwt)) {
            const response = await axios.post(
                `${process.env.REACT_APP_KAIRON_API_URL}/login/refresh`,
                null,
                { headers: { "Refresh-Token": refreshJwt } }
            );
            if (response.status === 200) {
                return response.data as JwtResponse;
            }
        }
        throw new Error();
    }
)