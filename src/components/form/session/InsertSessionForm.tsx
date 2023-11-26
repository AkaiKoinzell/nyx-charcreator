import {
    Button,
    Card,
    CardBody,
    CardHeader,
    Container,
    Heading,
    IconButton,
    VStack,
} from "@chakra-ui/react";
import { Character } from "../../../models/character/Character";
import { TextInput } from "../controls/TextInput";
import { CharacterInput } from "../controls/CharacterInput";
import { Player } from "../../../models/player/Player";
import { DatePicker } from "../controls/DatePicker";
import { Label } from "../../../models/label/Label";
import { LabelInput } from "../controls/LabelInput";
import { AddIcon } from "@chakra-ui/icons";
import { FormValue } from "../../../models/form/FormValue";
import { Participant } from "../../../models/form/Participant";
import { useReducer } from "react";
import { v4 as uuid } from "uuid";
import { ParticipantSelectorInput } from "./ParticipantSelectorInput";
import { SessionRegistrationDto } from "../../../models/session/SessionRegistrationDto";

enum InsertSessionActionType {
    SET_TITLE,
    SET_MASTER,
    SET_DATE,
    SET_LABELS,
    ADD_PARTICIPANT,
    REMOVE_PARTICIPANT,
}

type InsertSessionFormProps = {
    characters: Character<Player>[] | undefined;
    labels: Label[] | undefined;
    submitForm: (form: SessionRegistrationDto) => void;
};

export const InsertSessionForm = ({
    characters,
    labels,
    submitForm,
}: InsertSessionFormProps) => {
    const [formState, dispatchFormState] = useReducer(
        formStateReducer,
        initialState
    );

    const handleAddParticipant = () => {
        dispatchFormState({
            type: InsertSessionActionType.ADD_PARTICIPANT,
            id: uuid(),
            payload: { value: undefined, isValid: false },
        });
    };

    const handleRemoveParticipant = (id: string) => {
        dispatchFormState({
            type: InsertSessionActionType.REMOVE_PARTICIPANT,
            id,
            payload: { value: undefined, isValid: false },
        });
    };

    const handleSubmit = () => {
        if (isFormValid(formState)) {
            submitForm({
                masterId: formState.master.value!,
                masterReward: 1,
                title: formState.title.value!,
                date: formState.date.value!.getTime(),
                labels: (formState.labels.value ?? []).map((it) => ({
                    id: it.id,
                    name: it.name,
                })),
                outcomes: Object.values(formState.participants).map((it) => ({
                    characterId: it.value?.characterId!,
                    exp: it.value?.exp!,
                    isDead: it.value?.isDead!,
                })),
            });
        }
    };

    const isValid = isFormValid(formState);

    return (
        <Card width="50vw">
            <CardHeader>
                <Heading>Insert a New Session</Heading>
            </CardHeader>
            <CardBody>
                <TextInput
                    label="Title"
                    placeholder="Session title"
                    validator={(input?: string) => !!input && input.length > 0}
                    valueConsumer={(value: FormValue<string>) => {
                        dispatchFormState({
                            type: InsertSessionActionType.SET_TITLE,
                            id: "title",
                            payload: value,
                        });
                    }}
                    invalidLabel={"Title cannot be empty"}
                />
                <CharacterInput
                    label="Master"
                    placeholder="Select a character"
                    characters={characters}
                    validator={(input?: Character<Player>[]) =>
                        !!input && input.length > 0
                    }
                    valueConsumer={(value: FormValue<Character<Player>>) => {
                        dispatchFormState({
                            type: InsertSessionActionType.SET_MASTER,
                            id: "master",
                            payload: {
                                value: value.value?.id,
                                isValid: value.isValid,
                            },
                        });
                    }}
                    invalidLabel={"You must choose a valid master character"}
                />
                <DatePicker
                    label="Session Date"
                    valueConsumer={(value: FormValue<Date>) => {
                        dispatchFormState({
                            type: InsertSessionActionType.SET_DATE,
                            id: "date",
                            payload: value,
                        });
                    }}
                />
                <LabelInput
                    label="Labels"
                    placeholder="Select a label"
                    labels={labels}
                    valueConsumer={(value: FormValue<Label[]>) => {
                        dispatchFormState({
                            type: InsertSessionActionType.SET_LABELS,
                            id: "labels",
                            payload: value,
                        });
                    }}
                />
                <Container width="100%" maxWidth="max-content">
                    <VStack>
                        {Object.keys(formState.participants).map((it, idx) => (
                            <ParticipantSelectorInput
                                key={it}
                                index={idx}
                                characters={characters}
                                onClose={() => handleRemoveParticipant(it)}
                                valueConsumer={(
                                    value: FormValue<Participant>
                                ) => {
                                    dispatchFormState({
                                        type: InsertSessionActionType.ADD_PARTICIPANT,
                                        id: it,
                                        payload: value,
                                    });
                                }}
                            />
                        ))}
                    </VStack>
                    <IconButton
                        marginTop="1em"
                        aria-label="Add a Participant"
                        size="md"
                        colorScheme="blue"
                        icon={<AddIcon />}
                        width="100%"
                        onClick={handleAddParticipant}
                    />
                </Container>
                <Button
                    isActive={isValid}
                    isDisabled={!isValid}
                    onClick={handleSubmit}
                >
                    Save
                </Button>
            </CardBody>
        </Card>
    );
};

type InsertSessionState = {
    title: FormValue<string>;
    master: FormValue<string>;
    date: FormValue<Date>;
    labels: FormValue<Label[]>;
    participants: { [key: string]: FormValue<Participant> };
};

const initialState: InsertSessionState = {
    title: { value: undefined, isValid: false },
    master: { value: undefined, isValid: false },
    date: { value: new Date(), isValid: true },
    labels: { value: [], isValid: true },
    participants: {
        [uuid()]: { value: undefined, isValid: false },
    },
};

type InsertSessionAction = {
    type: InsertSessionActionType;
    id: string;
    payload: FormValue<string | Date | Label[] | Participant>;
};

function formStateReducer(
    state: InsertSessionState,
    action: InsertSessionAction
): InsertSessionState {
    switch (action.type) {
        case InsertSessionActionType.ADD_PARTICIPANT: {
            return {
                ...state,
                participants: {
                    ...state.participants,
                    [action.id]: action.payload as FormValue<Participant>,
                },
            };
        }
        case InsertSessionActionType.REMOVE_PARTICIPANT: {
            return {
                ...state,
                participants: Object.fromEntries(
                    Object.entries(state.participants).filter(
                        (it) => it[0] !== action.id
                    )
                ),
            };
        }
        case InsertSessionActionType.SET_TITLE: {
            return {
                ...state,
                title: action.payload as FormValue<string>,
            };
        }
        case InsertSessionActionType.SET_MASTER: {
            return {
                ...state,
                master: action.payload as FormValue<string>,
            };
        }
        case InsertSessionActionType.SET_DATE: {
            return {
                ...state,
                date: action.payload as FormValue<Date>,
            };
        }
        case InsertSessionActionType.SET_LABELS: {
            return {
                ...state,
                labels: action.payload as FormValue<Label[]>,
            };
        }
        default: {
            return state;
        }
    }
}

export const isFormValid = (state: InsertSessionState) =>
    state.title.isValid &&
    state.date.isValid &&
    state.labels.isValid &&
    state.master.isValid &&
    Object.values(state.participants).length > 0 &&
    Object.values(state.participants).every((it) => it.isValid);
