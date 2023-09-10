import { Outlet } from "react-router-dom";
import { AvatarButton } from "../components/ui/AvatarButton";
import { useDisclosure } from "@chakra-ui/react";
import { MenuDrawer } from "../components/menu/MenuDrawer";
import { useAppSelector } from "../hooks/redux";
import { authSelector } from "../store/auth/auth-slice";

export const MainMenu = () => {
    const { isOpen: isMenuOpen, onOpen: onOpenMenu, onClose: onCloseMenu } = useDisclosure()
    const authState = useAppSelector(authSelector)
    return (
        <>
            {!!authState && !isMenuOpen && <AvatarButton onClick={onOpenMenu} />}
            {!!authState && <MenuDrawer isOpen={isMenuOpen} onClose={onCloseMenu} />}
            <main>
                <Outlet />
            </main>
        </>
    );
};
