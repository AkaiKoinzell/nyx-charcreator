import { Container, Heading, Skeleton, VStack } from "@chakra-ui/react";
import { CharacterCard } from "./CharacterCard";
import { Character } from "../../models/character/Character";

export const CharacterList = ({
    characters,
}: {
    characters: Character<string>[] | undefined;
}) => {
    return (
        <VStack spacing="2rem">
            <Container>
                <Heading>Your active characters</Heading>
            </Container>
            <VStack spacing="2rem">
                {!!characters &&
                    characters.map((it) => (
                        <CharacterCard key={it.id} character={it} />
                    ))}
                {!characters &&
                    [1, 2, 3, 4, 5].map((it) => (
                        <Container key={it}>
                            <Skeleton height="10vh"></Skeleton>
                        </Container>
                    ))}
            </VStack>
        </VStack>
    );
};
