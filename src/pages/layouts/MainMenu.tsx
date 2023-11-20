import { Outlet } from "react-router-dom";
import { Box, Flex } from "@chakra-ui/react";
import { useAppSelector } from "../../hooks/redux";
import { roleSelector } from "../../store/auth/auth-slice";
import { TopMenu } from "../../components/menu/TopMenu";

export const MainMenu = () => {
    const roles = useAppSelector(roleSelector);

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
