import { Container, Heading, VStack } from "@chakra-ui/react";
import { CharacterCard } from "./CharacterCard";
import { Character } from "../../models/character/Character";

export const CharacterList = ({ characters }: { characters: Character[] }) => {
    const x = [2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 0];
    return (
        <VStack spacing="2rem">
            <Container>
                <Heading>Your active characters</Heading>
            </Container>
            <VStack spacing="2rem">
                {!!characters &&
                    characters.map((it) =>
                        x.map((itt) => 
                            <CharacterCard key={itt} character={it} />
                        )
                    )}
            </VStack>
        </VStack>
    );
};
