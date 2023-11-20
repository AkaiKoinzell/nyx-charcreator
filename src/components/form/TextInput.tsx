import { FormControl, FormLabel, Input } from "@chakra-ui/react";

export type TextInputProps = {
    label: string;
    placeholder: string;
};

export const TextInput = ({ label, placeholder }: TextInputProps) => {
    return (
        <FormControl>
            <FormLabel>
                {label}
                <Input placeholder={placeholder} />
            </FormLabel>
        </FormControl>
    );
};
