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
    max?: number;
    min?: number;
    formMarginLeft?: string;
};

export const NumberInput = ({
    label,
    validator,
    valueConsumer,
    invalidLabel,
    max,
    min,
    formMarginLeft
}: NumberInputProps) => {
    const {
        getInputProps,
        getIncrementButtonProps,
        getDecrementButtonProps,
        valueAsNumber,
    } = useNumberInput({
        step: 1,
        defaultValue: min ?? 0,
        onChange: (_: string, valueAsNumber: number) => {
            if (!!valueConsumer) {
                valueConsumer({ value: valueAsNumber, isValid: !validator || validator(valueAsNumber) });
            }
        },
        onInvalid: (_: string, _value: string, valueAsNumber: number) => {
            if(!!valueConsumer && !!min && valueAsNumber < min) {
                valueConsumer({ value: min, isValid: !validator || validator(valueAsNumber) });
            } else if(!!valueConsumer && !!max && valueAsNumber > max) {
                valueConsumer({ value: max, isValid: !validator || validator(valueAsNumber) });
            }
        },
        max, min
    });

    const isValid = !validator || validator(valueAsNumber);

    const inc = getIncrementButtonProps();
    const dec = getDecrementButtonProps();
    const input = getInputProps();
    return (
        <FormControl marginLeft={formMarginLeft ?? "2em"}>
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
