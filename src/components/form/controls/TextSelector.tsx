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
    Text
} from "@chakra-ui/react";
import { useState } from "react";
import { FormValue } from "../../../models/form/FormValue";
import {generateSkeletons } from "../../ui/StackedSkeleton";

type TextSelectorProps<T> = {
    label: string;
    placeholder: string;
    entities: T[] | undefined;
    filterCondition: (entity: T, query: string) => boolean;
    keySelector: (entity: T) => string;
    displayText: (entity: T) => string;
    onClickSelector: (entity: T) => string;
    valueConsumer?: (entities: FormValue<T>) => void;
    validator?: (input: T[]) => boolean;
    invalidLabel?: string;
};

export function TextSelector<T>({
    label,
    placeholder,
    entities,
    filterCondition,
    displayText,
    keySelector,
    onClickSelector,
    valueConsumer,
    validator,
    invalidLabel
}: TextSelectorProps<T>) {
    const {
        isOpen,
        onOpen: popoverOpen,
        onClose: popoverClose,
    } = useDisclosure();
    const [finalValue, setFinalValue] = useState<FormValue<T>>({value: undefined, isValid: true})
    const [inputValue, setInputValue] = useState<string>("");
    const [filteredEntities, setFilteredEntities] = useState<T[]>(entities ?? []);

    const filterEntities = (value: string) => {
        const query = value.toLowerCase().trim();
        const queryResult =
            query.length > 0
                ? entities?.filter((e) => filterCondition(e, query))
                : entities;
        setInputValue(value);
        setFilteredEntities(queryResult ?? []);
        const formValue = queryResult?.length === 1? {
            value: !!queryResult ? queryResult[0] : undefined,
            isValid: !validator || validator(queryResult ?? [])
        } : { value: undefined, isValid: !validator || validator(queryResult ?? []) }
        setFinalValue(formValue)
        if(!!valueConsumer) {
            valueConsumer(formValue)
        }
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        popoverOpen();
        filterEntities(event.target.value);
    };

    const handleSelection = (query: string) => {
        popoverClose();
        filterEntities(query);
    };

    return (
        <>
            <FormLabel color={finalValue.isValid ? "" : "crimson"}> {label} </FormLabel>
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
                        borderColor={finalValue.isValid ? "" : "crimson"}
                        borderWidth={finalValue.isValid ? "" : "2px"}
                    />
                </PopoverTrigger>
                {!finalValue.isValid && !!invalidLabel && <Text fontSize='sm' color="crimson">{invalidLabel}</Text>}
                <PopoverContent>
                    <PopoverBody>
                        <VStack
                            divider={<StackDivider borderColor="gray.200" />}
                        >
                            {!!entities &&
                                filteredEntities.map((it) => (
                                    <Container
                                        key={keySelector(it)}
                                        borderRadius="md"
                                        _hover={{ bg: "blackAlpha.300" }}
                                        onClick={() => {
                                            handleSelection(
                                                onClickSelector(it)
                                            );
                                        }}
                                    >
                                        {displayText(it)}
                                    </Container>
                                ))}
                            {!entities && generateSkeletons({ quantity: 5, height: "1.5ex"})}
                        </VStack>
                    </PopoverBody>
                </PopoverContent>
            </Popover>
        </>
    );
}
