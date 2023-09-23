import { Button } from "@chakra-ui/react";
import { useAppDispatch } from "../hooks/redux";
import { resetAuthenticationState } from "../store/auth/auth-slice";
import {
    localStorageJwtKey,
    localStorageRefreshJwtKey,
} from "../store/auth/auth-thunk";
import { useGetCurrentMemberQuery } from "../services/guild";

export const CharacterPage = () => {
    const dispatch = useAppDispatch();
    const { data, error, isLoading } = useGetCurrentMemberQuery()

    const onLogout = () => {
        localStorage.removeItem(localStorageJwtKey);
        localStorage.removeItem(localStorageRefreshJwtKey);
        dispatch(resetAuthenticationState());
    };

    return (
        <>
            <h1>Your character</h1>
            <p>{JSON.stringify(data)}</p>
            <Button onClick={onLogout}>Logout</Button>
        </>
    );
};
