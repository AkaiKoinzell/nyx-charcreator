import { Center } from "@chakra-ui/react";
import { useGetCurrentActiveCharactersQuery } from "../services/character";
import { CharacterList } from "../components/character/CharacterList";

export const CharacterPage = () => {
    const { data, error, isLoading } = useGetCurrentActiveCharactersQuery();

    return (
        <Center>
            {!!data && <CharacterList characters={data} />}
        </Center>
    );
};
