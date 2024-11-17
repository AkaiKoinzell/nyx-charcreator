import {FormControl, FormLabel, Input, SpaceProps, Text} from "@chakra-ui/react";
import { FormValue } from "../../../models/form/FormValue";
import React, { useState } from "react";

export interface TextInputProps extends SpaceProps {
    label: string;
    placeholder: string;
    defaultValue?: string;
    validator?: (input?: string) => boolean;
    valueConsumer?: (value: FormValue<string>) => void;
    invalidLabel?: string;
};

export const TextInput = ({
    label,
    placeholder,
    validator,
    defaultValue,
    valueConsumer,
    invalidLabel,
    ...style
}: TextInputProps) => {
    const [value, setValue] = useState<FormValue<string>>({
        value: defaultValue,
        isValid: true,
    });

    const handleChange = (event: React.FormEvent<HTMLInputElement>) => {
        const input = event.currentTarget.value.trim();
        const newValue = {
            value: input,
            isValid: !validator || validator(input),
        };
        setValue(newValue);
        if (!!valueConsumer) {
            valueConsumer(newValue);
        }
    };

    return (
        <FormControl {...style}>
            <FormLabel color={value.isValid ? "" : "crimson"}>{label}</FormLabel>
            <Input
                placeholder={placeholder}
                borderColor={value.isValid ? "" : "crimson"}
                borderWidth={value.isValid ? "" : "2px"}
                onChange={handleChange}
                value={value.value ?? ''}
            />
            {!value.isValid && !!invalidLabel && <Text fontSize='sm' color="crimson">{invalidLabel}</Text>}
        </FormControl>
    );
};