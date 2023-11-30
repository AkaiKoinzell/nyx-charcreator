import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { jwtSelector, roleSelector } from "../../store/auth/auth-slice";
import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import { getToken } from "../../store/auth/auth-thunk";
import { Box, Flex } from "@chakra-ui/react";
import { TopMenu } from "../../components/menu/TopMenu";

export const AuthenticatedLayout = () => {
    const dispatch = useAppDispatch()
    dispatch(getToken())
    const jwt = useAppSelector(jwtSelector);
    const roles = useAppSelector(roleSelector);
    const navigate = useNavigate();

    useEffect(() => {
        if(!jwt) {
            navigate("/");
        }
    }, [jwt, navigate]);

    return (
        <>
            <Box>
                <TopMenu roles={roles} />
                <Flex
                    as="header"
                    w="100vw"
                    h="5vh"
                    background="rgb(255, 255, 255, 0)"
                ></Flex>
                <Outlet />
            </Box>
        </>
    );
};
