import {
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
    HStack,
    FormControl,
    Tag,
    TagLabel,
    TagCloseButton,
    Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { Label } from "../../../models/label/Label";
import { FormValue } from "../../../models/form/FormValue";

type LabelInputProps = {
    label: string;
    placeholder: string;
    labels: Label[] | undefined;
    valueConsumer?: (entities: FormValue<Label[]>) => void;
    validator?: (input: Label[]) => boolean;
    invalidLabel?: string;
};

export const LabelInput = ({
    label,
    placeholder,
    labels,
    valueConsumer,
    validator,
    invalidLabel,
}: LabelInputProps) => {
    const {
        isOpen,
        onOpen: popoverOpen,
        onClose: popoverClose,
    } = useDisclosure();
    const [selectedLabels, setSelectedLabels] = useState<FormValue<Label[]>>({
        value: [],
        isValid: true,
    });
    const [inputValue, setInputValue] = useState<string>("");
    const [filteredLabels, setFilteredLabels] = useState<Label[]>([]);

    const filterEntities = (value: string) => {
        const query = value.toLowerCase().trim();
        const queryResult =
            query.length > 0
                ? labels?.filter((l) => l.name.toLowerCase().startsWith(query))
                : labels;
        setInputValue(value);
        setFilteredLabels(queryResult ?? []);
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        popoverOpen();
        filterEntities(event.target.value);
    };

    const handleSelection = (labelId: string) => {
        popoverClose();
        const label = labels?.find((it) => it.id === labelId);
        if (!!label) {
            setSelectedLabels((currentLabels) => {
                if (currentLabels.value?.includes(label) === true) {
                    return currentLabels;
                } else {
                    const newLabels = [...(currentLabels.value ?? []), label];
                    const selectedLabels = {
                        value: newLabels,
                        isValid: !validator || validator(newLabels),
                    };
                    if(!!valueConsumer) {
                        valueConsumer(selectedLabels)
                    }
                    return(selectedLabels)
                }
            });
        }
        setInputValue("");
        setFilteredLabels(labels ?? []);
    };

    const handleLabelRemoval = (labelId: string) => {
        setSelectedLabels((currentLabels) => {
            const newLabels = (currentLabels.value ?? []).filter(
                (it) => it.id !== labelId
            );
            const selectedLabels = {
                value: newLabels,
                isValid: !validator || validator(newLabels),
            };
            if(!!valueConsumer) {
                valueConsumer(selectedLabels)
            }
            return(selectedLabels)
        });
    };

    return (
        <FormControl>
            <FormLabel color={selectedLabels.isValid ? "" : "crimson"}>
                {" "}
                {label}{" "}
            </FormLabel>
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
                        borderColor={selectedLabels.isValid ? "" : "crimson"}
                        borderWidth={selectedLabels.isValid ? "" : "2px"}
                    />
                </PopoverTrigger>
                {!selectedLabels.isValid && !!invalidLabel && (
                    <Text fontSize="sm" color="crimson">
                        {invalidLabel}
                    </Text>
                )}
                <PopoverContent>
                    <PopoverBody>
                        <VStack
                            divider={<StackDivider borderColor="gray.200" />}
                        >
                            {!!labels &&
                                filteredLabels.map((it) => (
                                    <Container
                                        key={it.id}
                                        borderRadius="md"
                                        _hover={{ bg: "blackAlpha.300" }}
                                        onClick={() => {
                                            handleSelection(it.id);
                                        }}
                                    >
                                        {it.name}
                                    </Container>
                                ))}
                            {!labels &&
                                [1, 2, 3, 4, 5].map((it) => (
                                    <Container key={it}>
                                        <Skeleton height="1.5ex"></Skeleton>
                                    </Container>
                                ))}
                        </VStack>
                    </PopoverBody>
                </PopoverContent>
                <Container padding="0.5em">
                    <HStack>
                        {(selectedLabels.value ?? []).map((it) => (
                            <Tag
                                size="md"
                                key={it.id}
                                borderRadius="full"
                                variant="solid"
                                colorScheme="green"
                            >
                                <TagLabel>{it.name}</TagLabel>
                                <TagCloseButton
                                    onClick={() => handleLabelRemoval(it.id)}
                                />
                            </Tag>
                        ))}
                    </HStack>
                </Container>
            </Popover>
        </FormControl>
    );
};
