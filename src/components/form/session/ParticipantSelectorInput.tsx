import { CloseIcon } from "@chakra-ui/icons";
import { Checkbox, FormControl, HStack, IconButton } from "@chakra-ui/react";
import { CharacterInput } from "../controls/CharacterInput";
import { Character } from "../../../models/character/Character";
import { Player } from "../../../models/player/Player";
import { NumberInput } from "../controls/NumberInput";
import { FormValue } from "../../../models/form/FormValue";
import { Participant } from "../../../models/form/Participant";
import { useState } from "react";

type ParticipantSelectorInputProps = {
    index: number;
    characters: Character<Player>[] | undefined;
    onClose: () => void;
    valueConsumer?: (entity: FormValue<Participant>) => void;
};

export const ParticipantSelectorInput = ({
    index,
    characters,
    onClose,
    valueConsumer,
}: ParticipantSelectorInputProps) => {
    const [isDead, setIsDead] = useState(false);
    const [exp, setExp] = useState(0);
    const [characterId, setCharacterId] = useState<string | undefined>(
        undefined
    );

    const handleStateUpdate = (
        localCharacterId?: string,
        localExp?: number,
        localIsDead?: boolean
    ) => {
        if (!!valueConsumer) {
            const coalescedCharacterId = localCharacterId ?? characterId;
            if (!!coalescedCharacterId) {
                valueConsumer({
                    value: {
                        characterId: coalescedCharacterId,
                        exp: localExp ?? exp,
                        isDead: localIsDead ?? isDead,
                    },
                    isValid: true,
                });
            } else {
                valueConsumer({ value: undefined, isValid: false });
            }
        }
    };

    return (
        <FormControl>
            <HStack>
                <IconButton
                    marginTop="2.5em"
                    isRound={true}
                    variant="outline"
                    aria-label="Close"
                    colorScheme="red"
                    size="xs"
                    icon={<CloseIcon />}
                    onClick={onClose}
                />
                <CharacterInput
                    label={`Participant ${index}`}
                    placeholder="Select a character"
                    characters={characters}
                    validator={(input?: Character<Player>[]) =>
                        !!input && input.length === 1
                    }
                    valueConsumer={(value: FormValue<Character<Player>>) => {
                        if (value.isValid && !!value.value) {
                            setCharacterId(value.value.id);
                            handleStateUpdate(value.value.id);
                        } else {
                            setCharacterId(undefined);
                            handleStateUpdate(undefined)
                        }
                    }}
                    invalidLabel={"You must choose a valid character"}
                />
                <NumberInput
                    label="Exp"
                    valueConsumer={(value: FormValue<number>) => {
                        if (value.isValid && !!value.value) {
                            setExp(value.value);
                            handleStateUpdate(undefined, value.value);
                        }
                    }}
                />
                <Checkbox
                    size="lg"
                    marginTop="2em"
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        setIsDead(event.target.checked);
                        handleStateUpdate(undefined, undefined, event.target.checked);
                    }}
                >
                    Dead
                </Checkbox>
            </HStack>
        </FormControl>
    );
};
