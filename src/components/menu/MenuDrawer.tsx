import {
    Button,
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerOverlay,
    VStack,
} from "@chakra-ui/react";
import { useAppDispatch } from "../../hooks/redux";
import { resetAuthenticationState } from "../../store/auth/auth-slice";
import {
    localStorageJwtKey,
    localStorageRefreshJwtKey,
} from "../../store/auth/auth-thunk";

type MenuDrawerProps = {
    isOpen: boolean;
    onClose: () => void;
};

export const MenuDrawer = ({ isOpen, onClose }: MenuDrawerProps) => {
    const dispatch = useAppDispatch();

    const onLogout = () => {
        localStorage.removeItem(localStorageJwtKey);
        localStorage.removeItem(localStorageRefreshJwtKey);
        dispatch(resetAuthenticationState());
    };

    return (
        <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
            <DrawerOverlay />
            <DrawerContent>
                <DrawerHeader>Hello</DrawerHeader>
                <VStack>
                    <Button colorScheme="red" onClick={onLogout}>Logout</Button>
                </VStack>
            </DrawerContent>
        </Drawer>
    );
};
