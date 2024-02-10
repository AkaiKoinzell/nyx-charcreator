import {Card, CardBody, CardHeader, Heading, Text} from "@chakra-ui/react";
import { Character } from "../../models/character/Character";
import {useNavigate} from "react-router-dom";

export const CharacterCard = ({ character }: { character: Character<string> }) => {
    const navigate = useNavigate()
    const characterShortDescription = `${character.characterClass?.join("/") ?? "??"} ${character.race}`

    const handleNavigation = () => {
        navigate(`/user/${character.id}`)
    }

    return (
        <Card _hover={{ cursor: "pointer"}} onClick={handleNavigation}>
            <CardHeader paddingBottom="0px">
                <Heading>{character.name}</Heading>
            </CardHeader>
            <CardBody>
                <Text>{characterShortDescription}</Text>
            </CardBody>
        </Card>
    );
};
