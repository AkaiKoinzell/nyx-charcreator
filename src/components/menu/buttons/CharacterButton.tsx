import {Button, Menu, MenuButton, MenuItem, MenuList} from "@chakra-ui/react";
import {ChevronDownIcon} from "@chakra-ui/icons";
import {Link} from "react-router-dom";

export const CharacterButton = ({ backgroundColor }: { backgroundColor: string }) => {
    return (
        <Menu>
            <MenuButton
                as={Button}
                rightIcon={<ChevronDownIcon />}
                background={backgroundColor}
                backdropFilter="saturate(180%) blur(5px)"
                borderRadius='0'
            >
                Characters
            </MenuButton>
            <MenuList>
            <Link to="/character/update"><MenuItem>Update Character</MenuItem></Link>
            </MenuList>
        </Menu>
    );
};