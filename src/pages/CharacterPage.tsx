import { Alert, AlertIcon, Center, AlertTitle, AlertDescription } from "@chakra-ui/react";
import { useGetCurrentActiveCharactersQuery } from "../services/character";
import { CharacterList } from "../components/character/CharacterList";

export const CharacterPage = () => {
    const { data: characters, error: charactersError } =
        useGetCurrentActiveCharactersQuery();

    return (
        <Center>
            {!!characters && <CharacterList characters={characters} />}
            {!!charactersError && (
                <Alert status="error">
                    <AlertIcon />
                    <AlertTitle>There was an erro while rloading your characters</AlertTitle>
                    <AlertDescription>
                        {JSON.stringify(charactersError)}
                    </AlertDescription>
                </Alert>
            )}
        </Center>
    );
};
