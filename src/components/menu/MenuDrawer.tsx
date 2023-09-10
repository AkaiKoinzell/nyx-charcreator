import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerOverlay,
} from "@chakra-ui/react";

type MenuDrawerProps = {
    isOpen: boolean;
    onClose: () => void;
};

export const MenuDrawer = ({ isOpen, onClose }: MenuDrawerProps) => {
    return (
        <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
            <DrawerOverlay />
            <DrawerContent>
                <DrawerHeader>Hello</DrawerHeader>
            </DrawerContent>
        </Drawer>
    );
};
