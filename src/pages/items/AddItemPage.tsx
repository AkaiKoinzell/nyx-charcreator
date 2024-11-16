import {AddItemForm} from "../../components/form/item/AddItemForm";
import {useGetLabelsQuery} from "../../services/label";
import {LabelType} from "../../models/label/LabelType";
import {ErrorAlertWithNavigation} from "../../components/ui/ErrorAlertWithNavigation";
import {Spinner} from "@chakra-ui/react";

export const AddItemPage = () => {
	const { data: loadedLabels, error: labelsError } = useGetLabelsQuery({
		labelType: LabelType.ITEM,
	});
	return (<>
		{!!loadedLabels && <AddItemForm itemLabels={loadedLabels} />}
		{!loadedLabels && !labelsError && <Spinner thickness='4px' speed='0.65s' emptyColor='gray.200' color='blue.500' size='xl' />}
		{!!labelsError && <ErrorAlertWithNavigation show={!!labelsError} navigateTo={"/"}/>}
	</>);

}