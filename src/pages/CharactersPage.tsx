import { Alert, AlertIcon, Center, AlertTitle, AlertDescription } from "@chakra-ui/react";
import { useGetCurrentActiveCharactersQuery } from "../services/character";
import { CharacterList } from "../components/character/CharacterList";

export const CharactersPage = () => {
    const { data: characters, error: charactersError} =
        useGetCurrentActiveCharactersQuery();

    return (
        <Center>
            <CharacterList characters={characters} />
            {!!charactersError && (
                <Alert status="error">
                    <AlertIcon />
                    <AlertTitle>There was an error while loading your characters</AlertTitle>
                    <AlertDescription>
                        {JSON.stringify(charactersError)}
                    </AlertDescription>
                </Alert>
            )}
        </Center>
    );
};
