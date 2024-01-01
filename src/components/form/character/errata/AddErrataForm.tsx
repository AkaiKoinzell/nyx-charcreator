import {Character} from "../../../../models/character/Character";
import {Player} from "../../../../models/player/Player";
import {AddErrataDto} from "../../../../models/character/errata/AddErrataDto";
import {Button, Card, CardBody, CardHeader, Center, Heading, VStack} from "@chakra-ui/react";
import {TextInput} from "../../controls/TextInput";
import {FormValue} from "../../../../models/form/FormValue";
import {CharacterInput} from "../../controls/CharacterInput";
import {TextSelector} from "../../controls/TextSelector";
import {CharacterStatus, CharacterStatuses} from "../../../../models/character/CharacterStatus";
import {NumberInput} from "../../controls/NumberInput";
import {useReducer} from "react";

type AddErrataFormProps = {
    characters: Character<Player>[] | undefined;
    submitForm: (form: AddErrataDto) => void;
};

enum AddErrataActionType {
    SET_CHARACTER,
    SET_EXP,
    SET_STATUS,
    SET_DESCRIPTION
}

export const AddErrataForm = ({ characters, submitForm }: AddErrataFormProps) => {
    const [formState, dispatchFormState] = useReducer(
        formStateReducer,
        initialState
    );

    const handleSubmit = () => {
        if (isFormValid(formState)) {
            submitForm({
                characterId: formState.characterId.value!,
                errata: {
                    ms: formState.exp.value ?? 0,
                    description: formState.description.value!,
                    date: new Date().getTime(),
                    statusChange: formState.status.value ?? null
                }
            });
        }
    };

    const isValid = isFormValid(formState);

    return (
        <Card width="50vw">
            <CardHeader>
                <Heading>Update a Character</Heading>
            </CardHeader>
            <CardBody>
                <CharacterInput
                    label="Character"
                    placeholder="Select a character"
                    characters={characters}
                    validator={(input?: Character<Player>[]) =>
                        !!input && input.length > 0
                    }
                    valueConsumer={(value: FormValue<Character<Player>>) => {
                        dispatchFormState({
                            type: AddErrataActionType.SET_CHARACTER,
                            payload: {
                                value: value.value?.id,
                                isValid: value.isValid,
                            },
                        });
                    }}
                    invalidLabel={"You must choose a valid character"}
                />
                <VStack>
                    <TextInput
                        label="Description"
                        placeholder="Description"
                        validator={(input?: string) => !!input && input.length > 0}
                        valueConsumer={(value: FormValue<string>) => {
                            dispatchFormState({
                                type: AddErrataActionType.SET_DESCRIPTION,
                                payload: value,
                            });
                        }}
                        invalidLabel={"Description cannot be empty"}
                    />
                    <TextSelector
                        label="Choose a new character status"
                        placeholder="Select a status"
                        entities={CharacterStatuses}
                        filterCondition={(entity, query) =>
                            entity.toLowerCase().startsWith(query)}
                        keySelector={(it) => it}
                        displayText={(it) => it}
                        onClickSelector={(it) => it}
                        valueConsumer={(value: FormValue<CharacterStatus>) => {
                            dispatchFormState({
                                type: AddErrataActionType.SET_STATUS,
                                payload: value,
                            });
                        }}
                    />
                    <NumberInput
                        label="Add or remove exp"
                        valueConsumer={(value: FormValue<number>) => {
                            dispatchFormState({
                                type: AddErrataActionType.SET_EXP,
                                payload: value,
                            });
                        }}
                    />
                    <Button
                        isActive={isValid}
                        isDisabled={!isValid}
                        onClick={handleSubmit}
                    >
                        Save
                    </Button>
                </VStack>
            </CardBody>
        </Card>
    );
}

type AddErrataState = {
    characterId: FormValue<string>;
    description: FormValue<string>;
    exp: FormValue<number>;
    status: FormValue<CharacterStatus>;
}

const initialState: AddErrataState = {
    characterId: { value: undefined, isValid: false },
    description: { value: undefined, isValid: false },
    exp: { value: 0, isValid: true },
    status: { value: undefined, isValid: true }
}

type AddErrataAction = {
    type: AddErrataActionType;
    payload: FormValue<string | CharacterStatus | number>;
};

function formStateReducer(
    state: AddErrataState,
    action: AddErrataAction
): AddErrataState {
    switch (action.type) {
        case AddErrataActionType.SET_CHARACTER: {
            return {
                ...state,
                characterId: action.payload as FormValue<string>,
            };
        }
        case AddErrataActionType.SET_DESCRIPTION: {
            return {
                ...state,
                description: action.payload as FormValue<string>,
            };
        }
        case AddErrataActionType.SET_EXP: {
            return {
                ...state,
                exp: action.payload as FormValue<number>,
            };
        }
        case AddErrataActionType.SET_STATUS: {
            return {
                ...state,
                status: action.payload as FormValue<CharacterStatus>,
            };
        }
        default: {
            return state;
        }
    }
}

export const isFormValid = (state: AddErrataState) =>
    state.characterId.isValid &&
    state.description.isValid &&
    (
        (state.exp.value! !== 0 && state.exp.isValid) ||
        (state.status.value !== undefined && state.status.isValid)
    )