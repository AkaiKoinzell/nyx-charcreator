import { Button, Center, Icon, Text, VStack } from "@chakra-ui/react";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { getToken } from "../store/auth/auth-thunk";
import { jwtSelector } from "../store/auth/auth-slice";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { BsDiscord } from "react-icons/bs";

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
        <Center>
            <VStack>
                <Text fontSize='5xl'>Welcome to Nyx!</Text>
                <Text fontSize='2xl'>A companion app for KaironBot</Text>
                <Button 
                    leftIcon={<Icon as={BsDiscord} />} 
                    backgroundColor="#5865F2" 
                    color='white' 
                    onClick={openDiscordAuthWindow}
                    >Login
                </Button>
            </VStack>        
        </Center>
    );
};

function openDiscordAuthWindow() {
    window.open(process.env.REACT_APP_DISCORD_OAUTH_URL, "_parent");
}
