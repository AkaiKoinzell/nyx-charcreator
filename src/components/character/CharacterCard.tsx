import {Avatar, Card, CardBody, CardHeader, Flex, Heading, Icon, Text} from "@chakra-ui/react";
import { Character } from "../../models/character/Character";
import {useNavigate} from "react-router-dom";
import {useCallback} from "react";
import {useGetCharacterTokenQuery} from "../../services/character";
import {FaHatWizard, FaPersonCane, FaSkull, FaStar, FaUser, FaUserShield} from "react-icons/fa6";
import {CharacterStatus} from "../../models/character/CharacterStatus";

interface CharacterCardProps {
	character: Character<string>
	linkToProfile: boolean
}

export const CharacterCard = ({ character, linkToProfile }: CharacterCardProps) => {
	const navigate = useNavigate()
	const characterShortDescription = `${character.characterClass?.join("/") ?? "??"} ${character.race}`
	const { data: token} = useGetCharacterTokenQuery(character.id)
	const defaultIcon = <FaHatWizard fontSize="1.6em"/>

	const handleNavigation = useCallback(() => {
		navigate(`/user/${character.id}`)
	}, [character.id, navigate])

	const statusColor = getStatusColor(character.status)
	const statusIcon = getStatusIcon(character.status)

	return (
		<Card _hover={{ cursor: linkToProfile ? "pointer" : undefined }} onClick={linkToProfile ? handleNavigation : undefined}>
			<CardHeader paddingBottom="0px">
				<Flex>
					<Avatar
						size='lg'
						bg='teal.300'
						icon={!token ? defaultIcon : undefined}
						src={!!token ? `data:${token.mimeType};base64,${token.image}`: undefined}
						mr="1em"
					/>
					<Flex direction="column">
						<Heading>{character.name}</Heading>
						<Text>{characterShortDescription}</Text>
					</Flex>
				</Flex>

			</CardHeader>
			<CardBody>
				<Flex align="center">
					<Icon as={statusIcon} color={statusColor} mr="0.5em" />
					<Text color={statusColor}>{character.status ?? "active"}</Text>
				</Flex>
			</CardBody>
		</Card>
	);
};

function getStatusIcon(status: CharacterStatus) {
	if(status === CharacterStatus.dead) {
		return FaSkull
	} else if (status === CharacterStatus.active) {
		return FaUserShield
	} else if (status === CharacterStatus.retired) {
		return FaPersonCane
	} else if (status === CharacterStatus.npc) {
		return FaStar
	} else {
		return FaUserShield
	}
}

function getStatusColor(status: CharacterStatus): string {
	if(status === CharacterStatus.active) {
		return "green"
	} else if (status === CharacterStatus.dead) {
		return "red"
	} else if (status === CharacterStatus.npc || status === CharacterStatus.retired)  {
		return "gray"
	} else {
		return "green"
	}
}