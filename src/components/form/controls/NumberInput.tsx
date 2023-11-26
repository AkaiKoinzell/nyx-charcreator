import {
    Button,
    FormControl,
    FormLabel,
    HStack,
    Input,
    useNumberInput,
    Text
} from "@chakra-ui/react";
import { FormValue } from "../../../models/form/FormValue";

export type NumberInputProps = {
    label: string;
    validator?: (input?: number) => boolean;
    valueConsumer?: (value: FormValue<number>) => void;
    invalidLabel?: string;
};

export const NumberInput = ({
    label,
    validator,
    valueConsumer,
    invalidLabel,
}: NumberInputProps) => {
    const {
        getInputProps,
        getIncrementButtonProps,
        getDecrementButtonProps,
        valueAsNumber,
    } = useNumberInput({
        step: 1,
        defaultValue: 0,
        onChange: (_: string, valueAsNumber: number) => {
            if (!!valueConsumer) {
                valueConsumer({ value: valueAsNumber, isValid });
            }
        }
    });

    const isValid = !validator || validator(valueAsNumber);

    const inc = getIncrementButtonProps();
    const dec = getDecrementButtonProps();
    const input = getInputProps();
    return (
        <FormControl marginLeft="2em">
            <FormLabel color={isValid ? "" : "crimson"}>{label}</FormLabel>
            <HStack>
                <Button {...dec}>-</Button>
                <Input
                    {...input}
                    width="4em"
                    borderColor={isValid ? "" : "crimson"}
                    borderWidth={isValid ? "" : "2px"}
                />
                <Button {...inc}>+</Button>
                {!isValid && !!invalidLabel && <Text fontSize='sm' color="crimson">{invalidLabel}</Text>}
            </HStack>
        </FormControl>
    );
};
