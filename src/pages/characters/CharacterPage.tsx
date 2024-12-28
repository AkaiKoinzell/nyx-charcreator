import { useParams } from "react-router-dom";
import { useGetCharacterByIdQuery } from "../../services/character";
import {ErrorAlertWithNavigation} from "../../components/ui/ErrorAlertWithNavigation";
import {CharacterDisplay} from "../../components/character/CharacterDisplay";
import {StackedSkeleton} from "../../components/ui/StackedSkeleton";

export const CharacterPage = () => {
	const { characterId } = useParams()
	if(characterId == null) {
		throw new Response("Not found", { status: 404 })
	}
	const { data: character, error: characterError } =
		useGetCharacterByIdQuery(characterId);

	return (<>
		<ErrorAlertWithNavigation
			show={!!characterError}
			navigateTo="/user"
		/>
		{!character && <StackedSkeleton quantity={5} height="5vh"/>}
		{!!character && <CharacterDisplay character={character} />}
	</>)
}