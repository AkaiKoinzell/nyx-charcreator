import {Button, Menu, MenuButton, MenuItem, MenuList} from "@chakra-ui/react";
import {ChevronDownIcon} from "@chakra-ui/icons";
import {Link} from "react-router-dom";
import {Role} from "../../../utils/jwt-utils";

export const PlayerButton = ({ backgroundColor }: { roles: Role[], backgroundColor: string }) => {
	return (
		<Menu>
			<MenuButton
				as={Button}
				rightIcon={<ChevronDownIcon />}
				background={backgroundColor}
				backdropFilter="saturate(180%) blur(5px)"
				borderRadius='0'
			>
				Players
			</MenuButton>
			<MenuList>
				<Link to="/player/all"><MenuItem>Browse Players</MenuItem></Link>
			</MenuList>
		</Menu>
	);
};