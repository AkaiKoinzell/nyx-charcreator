import { Center } from "@chakra-ui/react";
import { useGetAllActiveCharactersWithPlayerQuery } from "../../services/character";
import { InsertSessionForm } from "../../components/session/InserSessionForm";
import { ErrorAlertWithNavigation } from "../../components/ui/ErrorAlertWithNavigation";

export const InsertSessionPage = () => {
    const { data: activeCharacters, error: activeCharactersError } =
        useGetAllActiveCharactersWithPlayerQuery();

    return (
        <Center>
            <ErrorAlertWithNavigation
                show={!!activeCharactersError}
                navigateTo="/user"
            />
            {!activeCharactersError && (
                <InsertSessionForm characters={activeCharacters} />
            )}
        </Center>
    );
};
