import { Card, CardBody, CardHeader, HStack, Heading } from "@chakra-ui/react";
import { Character, exp } from "../../models/character/Character";
import { CharacterProp } from "./CharacterProp";

export const CharacterCard = ({ character }: { character: Character<string> }) => {
    return (
        <Card>
            <CardHeader>
                <Heading>{character.name}</Heading>
            </CardHeader>
            <CardBody>
                <HStack>
                    <CharacterProp propName="race" propValue={character.race} />
                    <CharacterProp
                        propName="class"
                        propValue={character.characterClass?.join(", ") ?? "No class found"}
                    />
                    <CharacterProp propName="exp" propValue={exp(character)} />
                </HStack>
            </CardBody>
        </Card>
    );
};
