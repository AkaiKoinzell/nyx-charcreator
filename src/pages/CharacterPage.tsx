import { Center } from "@chakra-ui/react";
import { useGetCurrentMemberQuery } from "../services/guild";

export const CharacterPage = () => {
    const { data, error, isLoading } = useGetCurrentMemberQuery()

    return (
        <Center>
            <h1>Your character</h1>
            <p>{JSON.stringify(data)}</p>
        </Center>
    );
};
