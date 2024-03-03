import { Box, Flex } from "@chakra-ui/react";
import { SessionButton } from "./buttons/SessionButton";
import { Role } from "../../utils/jwt-utils";
import { useGetCurrentMemberQuery } from "../../services/guild";
import { AvatarIcon } from "./AvatarIcon";
import React from "react";
import { CharacterButton } from "./buttons/CharacterButton";

export const TopMenu = ({ roles }: { roles: Role[] }) => {
    const { data: member } = useGetCurrentMemberQuery();

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
            {roles.includes(Role.MANAGE_SESSIONS) && <SessionButton roles={roles}/>}
            {roles.includes(Role.MANAGE_CHARACTERS) && <CharacterButton />}
            <Box position="absolute" right="2vw" paddingTop="0.25em">
                <AvatarIcon user={member} />
            </Box>
        </Flex>
    );
};
