import { Card, CardBody, CardHeader, Heading } from "@chakra-ui/react";
import { Character } from "../../models/character/Character";
import { TextInput } from "../form/TextInput";
import { CharacterInput } from "../form/CharacterInput";
import { Player } from "../../models/player/Player";
import { DatePicker } from "../form/DatePicker";

export type InsertSessionFormProps = {
    characters: Character<Player>[] | undefined
}

export const InsertSessionForm = ({ characters }: InsertSessionFormProps) => {
    return (
        <Card>
            <CardHeader>
                <Heading>Insert a New Session</Heading>
            </CardHeader>
            <CardBody>
                <TextInput label="Title" placeholder="Session title" />
                <CharacterInput label="Master" placeholder="Master character" characters={characters}/>
                <DatePicker label="Session Date" />
            </CardBody>
        </Card>
    );
};
