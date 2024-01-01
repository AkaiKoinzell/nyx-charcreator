import {useAddErrataMutation, useGetAllActiveCharactersWithPlayerQuery} from "../../services/character";
import {Center} from "@chakra-ui/react";
import {ErrorAlertWithNavigation} from "../../components/ui/ErrorAlertWithNavigation";
import {LoadingModal} from "../../components/ui/LoadingModal";
import {QueryStatus} from "@reduxjs/toolkit/query";
import {SuccessAlertWithNavigation} from "../../components/ui/SuccessAlertWithNaviagion";
import {AddErrataForm} from "../../components/form/character/errata/AddErrataForm";
import {useEffect, useState} from "react";
import {AddErrataDto} from "../../models/character/errata/AddErrataDto";

export const AddErrataPage = () => {
    const { data: activeCharacters, error: activeCharactersError } =
        useGetAllActiveCharactersWithPlayerQuery();
    const [addErrata, { status, error }] = useAddErrataMutation();

    const [formValues, setFormValues] = useState<AddErrataDto | undefined>(undefined);

    useEffect(() => {
        if (!!formValues) {
            addErrata(formValues)
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
    }, [formValues, addErrata]);

    return <Center>
        <ErrorAlertWithNavigation
            show={!!activeCharactersError}
            navigateTo="/user"
        />
        <LoadingModal
            show={status === QueryStatus.pending}
            title="Updating character..."
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
            <AddErrataForm
                characters={activeCharacters}
                submitForm={(form: AddErrataDto) => {
                    setFormValues(form);
                }}
            />
        )}
    </Center>
}