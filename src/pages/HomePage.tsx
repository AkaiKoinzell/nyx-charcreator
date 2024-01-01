import { Button, Container } from "@chakra-ui/react";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { getToken } from "../store/auth/auth-thunk";
import { jwtSelector } from "../store/auth/auth-slice";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export const HomePage = () => {
    const dispatch = useAppDispatch();
    dispatch(getToken());
    const jwt = useAppSelector(jwtSelector);
    const navigate = useNavigate();

    useEffect(() => {
        if (!!jwt) {
            navigate("/user");
        }
    }, [jwt, navigate]);

    return (
        <Container>
            {
                <Button onClick={openDiscordAuthWindow}>
                    Login with discord
                </Button>
            }
        </Container>
    );
};

function openDiscordAuthWindow() {
    window.open(process.env.REACT_APP_DISCORD_OAUTH_URL, "_parent");
}
