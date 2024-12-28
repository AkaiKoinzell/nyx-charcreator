import {
	Avatar,
	Flex,
	GridItem,
	Text, Icon,
	Stat,
	StatNumber,
} from "@chakra-ui/react";
import {Character} from "../../models/character/Character";
import React from "react";
import {useGetCharacterTokenQuery} from "../../services/character";
import { FaHatWizard } from "react-icons/fa6";
import {GiCloakDagger, GiMagicAxe, GiMagicSwirl, GiPunch} from "react-icons/gi";
import {LuSwords} from "react-icons/lu";
import {formatDate} from "../../utils/string-utils";
import {Player} from "../../models/player/Player";
import {CheckIcon, CloseIcon} from "@chakra-ui/icons";

interface PlayerRowProps {
	player: Player
	characters: Character<string>[]
}

export const PlayerRow = ({ player, characters }: PlayerRowProps) => {
	const lastActivity = characters.reduce((p, c) => {
		let lastCharActivity = (c.lastMastered ?? 0) > (c.lastPlayed ?? 0) ? (c.lastMastered ?? 0) : (c.lastPlayed ?? 0)
		return lastCharActivity > p ? lastCharActivity : p
	}, 0)
	return (
		<>
			<GridItem>
				<Stat>
					<StatNumber>{player.name}</StatNumber>
				</Stat>
			</GridItem>
			<GridItem>
				<Stat>
					<StatNumber>{!!player.dateJoined ? formatDate(player.dateJoined) : "Unknown"}</StatNumber>
				</Stat>
			</GridItem>
			<GridItem>
				<Stat>
					<StatNumber>{lastActivity > 0 ? formatDate(lastActivity) : "Never"}</StatNumber>
				</Stat>
			</GridItem>
			<GridItem>
				<Flex direction="column">
					{characters.map(it => <ReducedCharacterInfo key={it.id} character={it} />)}
				</Flex>
			</GridItem>
			<GridItem>
				{!!player.masterSince && <Icon as={CheckIcon} color="red" />}
				{!player.masterSince && <Icon as={CloseIcon} color="green" />}
			</GridItem>
		</>
	);
};

const ReducedCharacterInfo = ({ character }: { character: Character<string>}) => {
	const { data: token} = useGetCharacterTokenQuery(character.id)
	const defaultIcon = randomCharacterIcon()
	return (
		<Flex align="center">
			<Avatar
				size='sm'
				bg='teal.300'
				icon={!token ? defaultIcon : undefined}
				src={!!token ? `data:${token.mimeType};base64,${token.image}`: undefined}
				mr="1em"
				mt="0.5em"
			/>
			<Text as="b">{character.name}</Text>
		</Flex>
	)
}

const fallbackIcons = [
	<GiPunch fontSize="2em"/>,
	<FaHatWizard fontSize="1.6em"/>,
	<LuSwords fontSize="1.8em"/>,
	<GiCloakDagger fontSize="2em"/>,
	<GiMagicAxe fontSize="2.5em"/>,
	<GiMagicSwirl fontSize="2em"/>
]

function randomCharacterIcon() {
	return fallbackIcons[Math.floor(Math.random() * fallbackIcons.length)];
}