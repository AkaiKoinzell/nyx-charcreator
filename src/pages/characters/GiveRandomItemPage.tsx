import {
	useAddErrataMutation,
	useGetAllActiveCharactersWithPlayerQuery,
	useUpdateInventoryMutation
} from "../../services/character";
import {Center} from "@chakra-ui/react";
import {ErrorAlertWithNavigation} from "../../components/ui/ErrorAlertWithNavigation";
import {GiveRandomItemForm} from "../../components/form/character/GiveRandomItemForm";
import {useGetLabelsQuery} from "../../services/label";
import {LabelType} from "../../models/label/LabelType";
import {LoadingModal} from "../../components/ui/LoadingModal";
import {QueryStatus} from "@reduxjs/toolkit/query";
import {SuccessAlertWithNavigation} from "../../components/ui/SuccessAlertWithNaviagion";
import {useCallback} from "react";
import {Character} from "../../models/character/Character";
import {Player} from "../../models/player/Player";
import {UpdateInventoryOperation} from "../../models/character/UpdateInventoryDto";

export const GiveRandomItemPage = () => {
	const { data: characters, error: charactersError } = useGetAllActiveCharactersWithPlayerQuery();
	const { data: labels, error: labelsError } = useGetLabelsQuery({
		labelType: LabelType.ITEM,
	});
	const [updateInventory, { error, isLoading, isSuccess, isError }] = useUpdateInventoryMutation();

	const onSubmit = useCallback((character: Character<Player>, itemName: string) => {
		updateInventory({
			itemId: itemName,
			qty: 1,
			characterId: character.id,
			operation: UpdateInventoryOperation.ASSIGN
		})
	}, [updateInventory])

	return <Center>
		<ErrorAlertWithNavigation
			show={!!charactersError || !!labelsError}
			description={JSON.stringify(charactersError || labelsError)}
		/>
		<LoadingModal
			show={isLoading}
			title="Assigning item..."
		/>
		<ErrorAlertWithNavigation
			show={isError}
			description={JSON.stringify(error)}
		/>
		<SuccessAlertWithNavigation
			show={isSuccess}
			navigateTo="/user"
		/>
		{!!characters && !!labels && (
			<GiveRandomItemForm characters={characters} itemLabels={labels} onSubmit={onSubmit} />
		)}
	</Center>
}