import { Container, Heading, VStack } from "@chakra-ui/react";
import { CharacterCard } from "./CharacterCard";
import { Character } from "../../models/character/Character";

export const CharacterList = ({ characters }: { characters: Character<string>[] }) => {
    return (
        <VStack spacing="2rem">
            <Container>
                <Heading>Your active characters</Heading>
            </Container>
            <VStack spacing="2rem">
                {!!characters &&
                    characters.map((it) =>
                        <CharacterCard key={it.id} character={it} />
                    )}
            </VStack>
        </VStack>
    );
};
