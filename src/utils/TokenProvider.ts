import axios from "axios";
import { JwtResponse } from "../models/auth/JwtResponse";
import { a2b } from "./string-utils";

export class TokenProvider {
    private static instance: TokenProvider | null = null;
    private jwt: Promise<string | null>;
    private refreshJwt: string;

    static getInstance(tokens?: JwtResponse): TokenProvider | null {
        if (!!tokens) {
            this.instance = new TokenProvider(
                tokens.authToken,
                tokens.refreshToken
            );
           localStorage.setItem("authJwt", tokens.authToken);
           localStorage.setItem("refreshJwt", tokens.refreshToken);
        }
        if (!this.instance) {
            const jwt = localStorage.getItem("authJwt");
            const refresh = localStorage.getItem("refreshJwt");
            if (!!jwt && !!refresh) {
                this.instance = new TokenProvider(jwt, refresh);
            }
        }
        return this.instance;
    }

    static async getToken(): Promise<string | null> {
        const token = (await this.getInstance()?.getToken()) ?? null;
        if (!token) {
            this.instance = null;
            localStorage.removeItem("authJwt");
            localStorage.removeItem("refreshJwt");
        }
        return token;
    }

    private constructor(jwt: string, refreshJwt: string) {
        this.jwt = Promise.resolve(jwt);
        this.refreshJwt = refreshJwt;
    }

    async getToken(): Promise<string | null> {
        const currentToken = await this.jwt;
        if (!currentToken || this._isJwtInvalidOrExpired(currentToken)) {
            this.jwt = this._refreshAuthJwt();
        }
        return this.jwt;
    }

    private async _refreshAuthJwt(): Promise<string | null> {
        if (!this._isJwtInvalidOrExpired(this.refreshJwt)) {
            console.log("refresh");
            const response = await axios.post(
                `${process.env.REACT_APP_KAIRON_API_URL}/login/refresh`,
                null,
                { headers: { "Refresh-Token": this.refreshJwt } }
            );
            if (response.status === 200) {
                const payload = response.data as JwtResponse;
                this.refreshJwt = payload.refreshToken;
                return payload.authToken;
            }
        }
        return null;
    }

    private _isJwtInvalidOrExpired(jwt: string): boolean {
        const parts = jwt.split(".");
        if (parts.length !== 3) {
            return true;
        }
        const payload = this._base64Decode(parts[1]);
        // Using the 'exp' string is safe to use as it is part of the JWT RFC and cannot be modified by us.
        return (
            !("exp" in payload) || payload["exp"] * 1000 < new Date().getTime()
        );
    }

    private _base64Decode(encodedString: string): any {
        return JSON.parse(a2b(encodedString));
    }
}


