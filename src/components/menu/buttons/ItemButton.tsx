import { ChevronDownIcon } from "@chakra-ui/icons";
import { Menu, MenuButton, Button, MenuList, MenuItem } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useItemsPrefetch } from "../../../services/item";
import { useLabelPrefetch } from "../../../services/label";
import {Role} from "../../../utils/jwt-utils";
import {hasRole} from "../../../utils/role-utils";

export const ItemButton = ({ roles, backgroundColor }: { roles: Role[], backgroundColor: string }) => {
    const prefetchPaginatedItems = useItemsPrefetch("searchItems")
    const prefetchAllLabels = useLabelPrefetch("getLabels")
    return (
        <Menu>
            <MenuButton
                as={Button}
                rightIcon={<ChevronDownIcon />}
                background={ backgroundColor }
                backdropFilter="saturate(180%) blur(5px)"
                borderRadius='0'
                onMouseEnter={() => {
                        prefetchPaginatedItems({ limit: 10 }, { ifOlderThan: 3600 });
                        prefetchAllLabels({}, { ifOlderThan: 3600 })
                    }
                }
            >
                Items
            </MenuButton>
            <MenuList>
                <Link to="/item/list"><MenuItem>Items List</MenuItem></Link>
                {hasRole(roles, Role.MANAGE_ITEMS) &&<Link to="/item/add"><MenuItem>Add an Item</MenuItem></Link>}
                {hasRole(roles, Role.MANAGE_ITEMS) &&<Link to="/item/usage"><MenuItem>Item Usage</MenuItem></Link>}
            </MenuList>
        </Menu>
    );
}
