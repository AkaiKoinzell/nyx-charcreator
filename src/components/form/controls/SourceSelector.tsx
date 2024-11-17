import { FormControl } from "@chakra-ui/react";
import { TextSelector } from "./TextSelector";
import { FormValue } from "../../../models/form/FormValue";
import {ManualSource} from "../../../models/item/ManualSource";

type SourceSelectorProps = {
	label: string;
	placeholder: string;
	manuals: ManualSource[] | undefined;
	valueConsumer?: (entities: FormValue<ManualSource>) => void;
	validator?: (input?: ManualSource[]) => boolean;
	invalidLabel?: string;
	defaultValue?: ManualSource;
};

export const SourceSelector = ({
	label,
	placeholder,
	manuals,
	valueConsumer,
	validator,
	invalidLabel,
	defaultValue
}: SourceSelectorProps) => {
	return (
		<FormControl>
			<TextSelector<ManualSource>
				label={label}
				placeholder={placeholder}
				entities={manuals}
				filterCondition={(entity, query) =>
					entity.name.toLowerCase().startsWith(query) || entity.abbreviation.toLowerCase().startsWith(query)
				}
				displayText={(entity) =>
					`${entity.abbreviation} - ${entity.name}`
				}
				keySelector={(entity) => entity.abbreviation}
				onClickSelector={(entity) => entity.abbreviation}
				valueConsumer={valueConsumer}
				validator={validator}
				invalidLabel={invalidLabel}
				defaultValue={defaultValue}
			/>
		</FormControl>
	);
};
