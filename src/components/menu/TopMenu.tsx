import {  Flex } from "@chakra-ui/react";
import { SessionButton } from "./buttons/SessionButton";
import { Roles } from "../../utils/jwt-utils";

export const TopMenu = ({ roles }: { roles: Roles[]}) => {
    return (
        <Flex
            as="header"
            w="100vw"
            h="5vh"
            position="fixed"
            zIndex="sticky"
            background="rgb(255, 255, 255, 0.7)"
            pl="30vw"
            backdropFilter="saturate(180%) blur(5px)"
        >
            { roles.includes(Roles.MANAGE_SESIONS) && <SessionButton /> }
        </Flex>
    );
};
