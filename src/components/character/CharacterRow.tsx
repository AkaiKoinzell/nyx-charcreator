import {Avatar, Flex, GridItem, Heading, Stat, StatNumber, Text} from "@chakra-ui/react";
import {Character, exp} from "../../models/character/Character";
import React from "react";
import {useGetCharacterTokenQuery} from "../../services/character";
import { FaHatWizard } from "react-icons/fa6";
import {GiCloakDagger, GiMagicAxe, GiMagicSwirl, GiPunch} from "react-icons/gi";
import {LuSwords} from "react-icons/lu";
import {formatDate} from "../../utils/string-utils";

interface CharacterRowProps {
	character: Character<string>
}

export const CharacterRow = ({ character }: CharacterRowProps) => {
	const characterShortDescription = `${character.characterClass?.join("/") ?? "??"} ${character.race}`
	const { data: token} = useGetCharacterTokenQuery(character.id)
	const defaultIcon = randomCharacterIcon()

	return (
		<>
			<GridItem>
				<Flex align="center">
					<Avatar
						size='md'
						bg='teal.300'
						icon={!token ? defaultIcon : undefined}
						src={!!token ? `data:${token.mimeType};base64,${token.image}`: undefined}
						mr="1em"
						mt="0.5em"
					/>
					<Flex direction="column">
						<Heading>{character.name}</Heading>
						<Text>{characterShortDescription}</Text>
					</Flex>
				</Flex>
			</GridItem>
			<GridItem>
				<Stat>
					<StatNumber>{formatDate(character.created)}</StatNumber>
				</Stat>
			</GridItem>
			<GridItem>
				<Stat>
					<StatNumber>{exp(character)}</StatNumber>
				</Stat>
			</GridItem>
			<GridItem>
				<Stat>
					<StatNumber>{exp(character)}</StatNumber>
				</Stat>
			</GridItem>
			<GridItem>
				<Stat>
					<StatNumber>{character.money}</StatNumber>
				</Stat>
			</GridItem>
			<GridItem>
				<Stat>
					<StatNumber>{!!character.lastPlayed ? formatDate(character.lastPlayed) : "Never"}</StatNumber>
				</Stat>
			</GridItem>
		</>
	);
};

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