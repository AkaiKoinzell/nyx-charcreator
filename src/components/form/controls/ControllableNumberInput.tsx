import {
	FormControl,
	FormLabel,
	Input,
	useNumberInput,
	Text, Switch, Flex, SpaceProps
} from "@chakra-ui/react";
import { FormValue } from "../../../models/form/FormValue";
import React, {useState} from "react";

interface ControllableNumberInputProps extends SpaceProps {
	label: string;
	validator?: (input?: number | null) => boolean;
	valueConsumer?: (value: FormValue<number | null>) => void;
	invalidLabel?: string;
	max?: number;
	min?: number;
	defaultValue?: { isEnabled: boolean, value: number };
}

export const ControllableNumberInput = ({
	label,
	validator,
	valueConsumer,
	invalidLabel,
	max,
	min,
	defaultValue,
	...style
}: ControllableNumberInputProps) => {
	const [isEnabled, setIsEnabled] = useState<boolean>(defaultValue?.isEnabled ?? false)
	const {
		getInputProps,
		valueAsNumber,
	} = useNumberInput({
		step: 1,
		defaultValue: defaultValue?.value ?? min ?? 0,
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
	const changeComponentStatus = (e: React.ChangeEvent<HTMLInputElement>) => {
		if(!e.target.checked && !!valueConsumer) {
			valueConsumer({ value: null, isValid: !validator || validator(null) })
		} else if (e.target.checked && !!valueConsumer) {
			valueConsumer({ value: valueAsNumber, isValid: !validator || validator(valueAsNumber) })
		}
		setIsEnabled(e.target.checked)
	}

	const input = getInputProps();
	return (
		<FormControl {...style}>
			<Flex align="center">
				<Switch isChecked={isEnabled} onChange={changeComponentStatus} />
				<FormLabel color={isValid ? "" : "crimson"} mt="0.5em" ml="0.5em">{label}</FormLabel>
			</Flex>
			<Input
				{...input}
				width="8em"
				borderColor={isValid ? "" : "crimson"}
				borderWidth={isValid ? "" : "2px"}
				isDisabled={!isEnabled}
			/>
			{!isValid && !!invalidLabel && <Text fontSize='sm' color="crimson">{invalidLabel}</Text>}
		</FormControl>
	);
};