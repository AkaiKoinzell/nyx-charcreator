import {Role} from "./jwt-utils";

export function hasRole(roles: Role[], roleToCheck: Role): boolean {
	return roles.includes(Role.ADMIN) || roles.includes(roleToCheck);
}