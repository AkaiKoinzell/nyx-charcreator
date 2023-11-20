import { ChevronDownIcon } from "@chakra-ui/icons";
import { Button, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { Link } from "react-router-dom";

export const SessionButton = () => {
    return (
        <Menu>
            <MenuButton
                as={Button}
                rightIcon={<ChevronDownIcon />}
                background="rgb(255, 255, 255)"
                borderRadius='0'
            >
                Sessions
            </MenuButton>
            <MenuList>
                <MenuItem><Link to="/session/insert">Insert Session</Link></MenuItem>
            </MenuList>
        </Menu>
    );
};
