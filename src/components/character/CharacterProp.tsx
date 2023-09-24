import { Box, Stat, StatLabel, StatNumber } from "@chakra-ui/react";

type CharacterPropType = {
    propName: string;
    propValue: string | number;
};

export const CharacterProp = ({ propName, propValue }: CharacterPropType) => {
    return (
        <Box>
            <Stat>
                <StatLabel>{propName}</StatLabel>
                <StatNumber>{propValue}</StatNumber>
            </Stat>
        </Box>
    );
};
