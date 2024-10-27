import { ChevronDownIcon } from "@chakra-ui/icons";
import { Menu, MenuButton, Button, MenuList, MenuItem } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useItemsPrefetch } from "../../../services/item";
import { useLabelPrefetch } from "../../../services/label";

export const ItemButton = ({ backgroundColor }: { backgroundColor: string }) => {
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
            </MenuList>
        </Menu>
    );
}
