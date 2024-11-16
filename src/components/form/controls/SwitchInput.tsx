import {Flex, FormControl, FormLabel, SpaceProps, Switch} from "@chakra-ui/react";
import { FormValue } from "../../../models/form/FormValue";
import React, { useState } from "react";

interface SwitchInputProps {
	label: string;
	defaultValue: boolean;
	valueConsumer?: (value: FormValue<boolean>) => void;
};

export const SwitchInput = ({
	label,
	defaultValue,
	valueConsumer,
}: SwitchInputProps) => {
	const [value, setValue] = useState<FormValue<boolean>>({
		value: defaultValue,
		isValid: true,
	});

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const input = event.target.checked;
		const newValue = {
			value: input,
			isValid: true,
		};
		setValue(newValue);
		if (!!valueConsumer) {
			valueConsumer(newValue);
		}
	};

	return (
		<FormControl>
			<Flex align="center">
				<Switch isChecked={value.value} onChange={handleChange} />
				<FormLabel mt="0.5em" ml="0.5em">{label}</FormLabel>
			</Flex>
		</FormControl>
	);
};