import { useLocation, useNavigate } from "react-router-dom";
import { useDiscordLoginMutation } from "../services/auth";
import { useEffect, useRef } from "react";
import { useAppDispatch } from "../hooks/redux";
import {
    localStorageJwtKey,
    localStorageRefreshJwtKey,
} from "../store/auth/auth-thunk";
import {
    resetAuthenticationState,
    setAuthenticationState,
} from "../store/auth/auth-slice";
import { QueryStatus } from "@reduxjs/toolkit/dist/query";
import { Center, Spinner, Text, VStack } from "@chakra-ui/react";

export const AuthPage = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const debouncing = useRef(false);
    const { search } = useLocation();
    const [discordLogin, { status, error }] = useDiscordLoginMutation();

    const code = new URLSearchParams(search).get("code");

    useEffect(() => {
        if (!!code && !debouncing.current) {
            debouncing.current = true;
            discordLogin(code)
                .unwrap()
                .then(
                    (data) => {
                        localStorage.setItem(
                            localStorageJwtKey,
                            data.authToken
                        );
                        localStorage.setItem(
                            localStorageRefreshJwtKey,
                            data.refreshToken
                        );
                        dispatch(
                            setAuthenticationState({
                                jwt: data.authToken,
                                refreshJwt: data.refreshToken,
                            })
                        );
                    },
                    () => {
                        localStorage.removeItem(localStorageJwtKey);
                        localStorage.removeItem(localStorageRefreshJwtKey);
                        dispatch(resetAuthenticationState());
                    }
                );
        }
    }, [code, debouncing, discordLogin, dispatch]);

    useEffect(() => {
        if (status === QueryStatus.fulfilled) {
            navigate("/user");
        }
    }, [navigate, status]);

    return (
        <Center>
            {(status === QueryStatus.pending ||
                status === QueryStatus.uninitialized) && (
                <VStack>
                    <Text fontSize="4xl">Logging in...</Text>
                    <Spinner size='xl' colorScheme='blue' speed='0.6s'/>
                </VStack>
            )}
            {status === QueryStatus.fulfilled && <h1>Ok</h1>}
            {status === QueryStatus.rejected && (
                <h1>{JSON.stringify(error)}</h1>
            )}
        </Center>
    );
};
