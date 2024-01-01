import {Button, Menu, MenuButton, MenuItem, MenuList} from "@chakra-ui/react";
import {ChevronDownIcon} from "@chakra-ui/icons";
import {Link} from "react-router-dom";

export const CharacterButton = () => {
    return (
        <Menu>
            <MenuButton
                as={Button}
                rightIcon={<ChevronDownIcon />}
                background="rgb(255, 255, 255, 0.7)"
                backdropFilter="saturate(180%) blur(5px)"
                borderRadius='0'
            >
                Characters
            </MenuButton>
            <MenuList>
                <MenuItem><Link to="/character/update">Update Character</Link></MenuItem>
            </MenuList>
        </Menu>
    );
};