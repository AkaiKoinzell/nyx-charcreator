import {  Flex } from "@chakra-ui/react";

export const TopMenu = () => {
    return (
        <Flex
            as="header"
            w="100vw"
            h="5vh"
            position="fixed"
            zIndex="sticky"
            background="rgb(255, 255, 255, 0.7)"
            backdropFilter="saturate(180%) blur(5px)"
        ></Flex>
    );
};
