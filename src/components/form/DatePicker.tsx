import { FormControl, FormLabel } from "@chakra-ui/react";
import { SingleDatepicker } from "chakra-dayzed-datepicker";
import { useState } from "react";

export const DatePicker = ({ label }: { label: string }) => {
    const [date, setDate] = useState(new Date());

    return (
        <FormControl>
            <FormLabel>{label}</FormLabel>
            <SingleDatepicker
                name="date-input"
                date={date}
                onDateChange={setDate}
            />
        </FormControl>
    );
};
