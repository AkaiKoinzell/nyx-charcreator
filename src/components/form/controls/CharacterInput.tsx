import { FormControl } from "@chakra-ui/react";
import { Character } from "../../../models/character/Character";
import { Player } from "../../../models/player/Player";
import { TextSelector } from "./TextSelector";
import { FormValue } from "../../../models/form/FormValue";

type CharacterInputProps = {
    label: string;
    placeholder: string;
    characters: Character<Player>[] | undefined;
    valueConsumer?: (entities: FormValue<Character<Player>>) => void;
    validator?: (input?: Character<Player>[]) => boolean;
    invalidLabel?: string;
};

export const CharacterInput = ({
    label,
    placeholder,
    characters,
    valueConsumer,
    validator,
    invalidLabel
}: CharacterInputProps) => {
    return (
        <FormControl>
            <TextSelector<Character<Player>>
                label={label}
                placeholder={placeholder}
                entities={characters}
                filterCondition={(entity, query) =>
                    entity.name.toLowerCase().startsWith(query)
                }
                displayText={(entity) =>
                    `${entity.name} (${entity.player.name})`
                }
                keySelector={(entity) => entity.id}
                onClickSelector={(entity) => entity.name}
                valueConsumer={valueConsumer}
                validator={validator}
                invalidLabel={invalidLabel}
            />
        </FormControl>
    );
};
