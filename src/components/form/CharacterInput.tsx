import {
    FormControl,
    FormLabel,
    Input,
    Popover,
    PopoverContent,
    PopoverTrigger,
    PopoverBody,
    VStack,
    Container,
    StackDivider,
    useDisclosure,
    Skeleton,
} from "@chakra-ui/react";
import { Character } from "../../models/character/Character";
import { useState } from "react";
import { Player } from "../../models/player/Player";

type CharacterInputProps = {
    label: string;
    placeholder: string;
    characters: Character<Player>[] | undefined;
};

export const CharacterInput = ({
    label,
    placeholder,
    characters,
}: CharacterInputProps) => {
    const {
        isOpen,
        onOpen: popoverOpen,
        onClose: popoverClose,
    } = useDisclosure();
    const [inputValue, setInputValue] = useState<string>("");
    const [filteredCharacters, setFilteredCharacters] = useState<
        Character<Player>[]
    >([]);

    const filterCharacters = (value: string) => {
        const query = value.toLowerCase().trim();
        const queryResult =
            query.length > 0
                ? characters?.filter((c) =>
                      c.name.toLowerCase().startsWith(query)
                  )
                : characters;
        setInputValue(value);
        setFilteredCharacters(queryResult ?? []);
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        popoverOpen();
        filterCharacters(event.target.value);
    };

    const handleSelection = (characterName: string) => {
        popoverClose();
        filterCharacters(characterName);
    };

    return (
        <FormControl>
            <FormLabel> {label} </FormLabel>
            <Popover
                closeOnBlur={false}
                closeOnEsc={true}
                isOpen={isOpen}
                onOpen={popoverOpen}
                onClose={popoverClose}
                autoFocus={false}
            >
                <PopoverTrigger>
                    <Input
                        placeholder={placeholder}
                        value={inputValue}
                        onChange={handleChange}
                        onBlur={popoverClose}
                    />
                </PopoverTrigger>
                <PopoverContent>
                    <PopoverBody>
                        <VStack
                            divider={<StackDivider borderColor="gray.200" />}
                        >
                            {!!characters &&
                                filteredCharacters.map((it) => (
                                    <Container
                                        key={it.id}
                                        borderRadius="md"
                                        _hover={{ bg: "blackAlpha.300" }}
                                        onClick={() => {
                                            handleSelection(it.name);
                                        }}
                                    >
                                        {it.name} ({it.player.name})
                                    </Container>
                                ))}
                            {!characters &&
                                [1, 2, 3, 4, 5].map((it) => (
                                    <Container key={it}>
                                        <Skeleton height="1.5ex"></Skeleton>
                                    </Container>
                                ))}
                        </VStack>
                    </PopoverBody>
                </PopoverContent>
            </Popover>
        </FormControl>
    );
};
