import {Button, Menu, MenuButton, MenuItem, MenuList} from "@chakra-ui/react";
import {ChevronDownIcon} from "@chakra-ui/icons";
import {Link} from "react-router-dom";
import {hasRole} from "../../../utils/role-utils";
import {Role} from "../../../utils/jwt-utils";

export const CharacterButton = ({ roles, backgroundColor }: { roles: Role[], backgroundColor: string }) => {
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
				{ hasRole(roles, Role.MANAGE_CHARACTERS) && <Link to="/character/update"><MenuItem>Update Character</MenuItem></Link> }
				{ hasRole(roles, Role.MANAGE_CHARACTERS) && <Link to="/character/giveRandomItem"><MenuItem>Give a Random Item</MenuItem></Link> }
				<Link to="/character/all"><MenuItem>Browse Characters</MenuItem></Link>
			</MenuList>
		</Menu>
	);
};