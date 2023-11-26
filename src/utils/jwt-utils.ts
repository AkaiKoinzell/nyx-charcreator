import { a2b } from "./string-utils";

export function isJwtInvalidOrExpired(jwt: string): boolean {
    return getJwtExpirationMillis(jwt) < new Date().getTime();
}

export function getJwtExpirationMillis(jwt: string): number {
    const parts = jwt.split(".");
    if (parts.length !== 3) {
        return 0;
    }
    const payload = JSON.parse(a2b(parts[1]));
    // Using the 'exp' string is safe to use as it is part of the JWT RFC and cannot be modified by us.
    return ("exp" in payload) && !isNaN(+payload["exp"]) ? payload["exp"] * 1000 : 0
}

export enum Roles {
    ADMIN,
    MANAGE_SESIONS,
    PLAYER
}

const reverseEnum: { [key: string]: Roles} = {
    "a": Roles.ADMIN,
    "mS": Roles.MANAGE_SESIONS,
    "p": Roles.PLAYER
}

export function getRolesFromJwt(jwt: string | null): Roles[] {
    if(!jwt) return [];
    const parts = jwt.split(".");
    if (parts.length !== 3) {
        throw Error("Invalid JWT format");
    }
    try {
        const rawRoles = JSON.parse(JSON.parse(a2b(parts[1]))["r"]) as string[];
        if(!rawRoles) {
            throw Error("Invalid JWT format");
        }
        return rawRoles.map( it => {
            const role = reverseEnum[it]
            if(!!role) {
                return role
            } else {
                throw Error(`Invalid Roles: ${it}`);
            }
        })
    } catch(e) {
        return [];
    }
}