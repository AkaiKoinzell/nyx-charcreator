import {Character} from "../../models/character/Character";
import {Heading, Text} from "@chakra-ui/react";

export const CharacterInfo = ({ character }: { character: Character<string>}) => {
    return <>
        <Heading size="lg">{character.name}</Heading>
        <Text>{`${character.characterClass?.join("/") ?? "??"} ${character.race}`}</Text>
    </>
}