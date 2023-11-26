import { FormControl, FormLabel, Text } from "@chakra-ui/react";
import { SingleDatepicker } from "chakra-dayzed-datepicker";
import { useState } from "react";
import { FormValue } from "../../../models/form/FormValue";

type DatePickerProps = {
    label: string
    initialDate?: Date
    validator?: (input?: Date) => boolean;
    valueConsumer?: (value: FormValue<Date>) => void;
    invalidLabel?: string;
}

export const DatePicker = ({ label, initialDate, validator, valueConsumer, invalidLabel }: DatePickerProps) => {
    const [date, setDate] = useState<FormValue<Date>>({value: initialDate ?? new Date(), isValid: true});

    const handleDateChange = (date: Date) => {
        const newValue = {
            value: date, 
            isValid: !validator || validator(date)
        }
        setDate(newValue)
        if(!!valueConsumer) {
            valueConsumer(newValue)
        }

    }

    return (
        <FormControl>
            <FormLabel color={date.isValid ? "" : "crimson"}>{label}</FormLabel>
            <SingleDatepicker
                name="date-input"
                date={date.value}
                onDateChange={handleDateChange}
            />
            {!date.isValid && !!invalidLabel && <Text fontSize='sm' color="crimson">{invalidLabel}</Text>}
        </FormControl>
    );
};
