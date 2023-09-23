import { Button, Container } from "@chakra-ui/react";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { getToken } from "../store/auth/auth-thunk";
import { jwtSelector } from "../store/auth/auth-slice";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export const HomePage = () => {
    const dispatch = useAppDispatch()
    dispatch(getToken())
    const jwt = useAppSelector(jwtSelector);
    const navigate = useNavigate();

    useEffect(() => {
        if(!!jwt) {
            navigate("/user");
        }
    }, [jwt, navigate]);

    return (
        <Container>
            {!false && (
                <Button onClick={openDiscordAuthWindow}>
                    Login with discord
                </Button>
            )}
            {false && <p>{"test"}</p>}
        </Container>
    );
};

function openDiscordAuthWindow() {
    window.open(
        "https://discord.com/api/oauth2/authorize?client_id=1049036547405647922&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth&response_type=code&scope=identify%20guilds.members.read",
        "_parent"
    );
}
