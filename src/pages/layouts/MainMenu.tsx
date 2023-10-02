import { Outlet } from "react-router-dom";
import { AvatarButton } from "../../components/ui/AvatarButton";
import { Box, Flex, useDisclosure } from "@chakra-ui/react";
import { MenuDrawer } from "../../components/menu/MenuDrawer";
import { useAppSelector } from "../../hooks/redux";
import { jwtSelector } from "../../store/auth/auth-slice";
import { TopMenu } from "../../components/menu/TopMenu";

export const MainMenu = () => {
    const {
        isOpen: isMenuOpen,
        onOpen: onOpenMenu,
        onClose: onCloseMenu,
    } = useDisclosure();
    const jwt = useAppSelector(jwtSelector);

    return (
        <>
            {false && !!jwt && !isMenuOpen && (
                <AvatarButton onClick={onOpenMenu} />
            )}
            {false && !!jwt && (
                <MenuDrawer isOpen={isMenuOpen} onClose={onCloseMenu} />
            )}
            <Box>
                <TopMenu />
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
