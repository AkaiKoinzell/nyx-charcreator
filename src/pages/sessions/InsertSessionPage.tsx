import { Center } from "@chakra-ui/react";
import { useGetAllActiveCharactersWithPlayerQuery } from "../../services/character";
import { InsertSessionForm } from "../../components/form/session/InsertSessionForm";
import { ErrorAlertWithNavigation } from "../../components/ui/ErrorAlertWithNavigation";
import { useGetLabelsQuery } from "../../services/label";
import { LabelType } from "../../models/label/LabelType";
import { useRegisterSessionMutation } from "../../services/session";
import { SessionRegistrationDto } from "../../models/session/SessionRegistrationDto";
import { useState, useEffect } from "react";
import { LoadingModal } from "../../components/ui/LoadingModal";
import { QueryStatus } from "@reduxjs/toolkit/dist/query";
import { SuccessAlertWithNavigation } from "../../components/ui/SuccessAlertWithNaviagion";

export const InsertSessionPage = () => {
    const { data: activeCharacters, error: activeCharactersError } =
        useGetAllActiveCharactersWithPlayerQuery();
    const { data: loadedLabels, error: labelsError } = useGetLabelsQuery({
        labelType: LabelType.SESSION,
    });
    const [formValues, setFormValues] = useState<
        SessionRegistrationDto | undefined
    >(undefined);
    const [registerSession, { status, error }] = useRegisterSessionMutation();

    useEffect(() => {
        if (!!formValues) {
            registerSession(formValues)
                .unwrap()
                .then(
                    () => {
                        console.log("ok");
                    },
                    (e) => {
                        console.log(e);
                    }
                );
        }
    }, [formValues, registerSession]);

    return (
        <Center>
            <ErrorAlertWithNavigation
                show={!!activeCharactersError || !!labelsError}
                navigateTo="/user"
            />
            <LoadingModal
                show={status === QueryStatus.pending}
                title="Registering session..."
            />
            <ErrorAlertWithNavigation
                show={status === QueryStatus.rejected}
                description={JSON.stringify(error)}
            />
            <SuccessAlertWithNavigation
                show={status === QueryStatus.fulfilled}
                navigateTo="/user"
            />
            {!activeCharactersError && (
                <InsertSessionForm
                    characters={activeCharacters}
                    labels={loadedLabels}
                    submitForm={(form: SessionRegistrationDto) => {
                        setFormValues(form);
                    }}
                />
            )}
        </Center>
    );
};
