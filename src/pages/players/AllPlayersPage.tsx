import {useGetAllActiveCharactersQuery} from "../../services/character";
import React, {useCallback, useEffect, useMemo, useState} from "react";
import {Character} from "../../models/character/Character";
import {
	Flex,
	Grid,
	GridItem, Icon,
	Input,
	InputGroup,
	InputLeftAddon,
	InputRightElement,
	Spinner,
	Text
} from "@chakra-ui/react";
import {SearchIcon, TriangleDownIcon, TriangleUpIcon} from "@chakra-ui/icons";
import {playersToCharacters} from "../../utils/player-utils";
import {useGetPlayersQuery} from "../../services/player";
import {Player} from "../../models/player/Player";
import {PlayerRow} from "../../components/player/PlayerRow";

export const AllPlayersPage = () => {
	const { data: characters } = useGetAllActiveCharactersQuery()
	const pTC: {[key: string]: Character<string>[]} = useMemo(() => {
		if (characters != null) {
			return playersToCharacters(characters)
		} else {
			return {}
		}
	}, [characters])
	const { data: players } = useGetPlayersQuery(
		Object.keys(pTC),
		{ skip: Object.keys(pTC).length === 0 }
	)
	const [sortedPlayers, setSortedPlayers] = useState<Player[]>([])
	const [sortProperty, setSortProperty] = useState<{ prop: string, dir: number } | undefined>(undefined)
	const [isTyping, setIsTyping] = useState(false);
	const [query, setQuery] = useState<string | undefined>(undefined);

	useEffect(() => {
		if (players != null) {
			setSortedPlayers([...players])
		}
	}, [players])

	const onChangeFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
		if(e.target.value.trim().length > 0) {
			setQuery(e.target.value.trim());
		} else {
			setQuery(undefined);
		}
	}

	const onSort = useCallback((property: string) => {
		const newParams = sortProperty?.prop === property
			? { prop: property, dir: sortProperty.dir * -1 }
			: { prop: property, dir: 1 }
		setSortProperty(newParams)
		setSortedPlayers(current => current.sort((a, b) => {
			const valA: string | number = property === "lastActivity"
				? (pTC[a.playerId] ?? []).reduce((p, c) => {
					let lastCharActivity = (c.lastMastered ?? 0) > (c.lastPlayed ?? 0) ? (c.lastMastered ?? 0) : (c.lastPlayed ?? 0)
					return lastCharActivity > p ? lastCharActivity : p
				}, 0)
				// @ts-ignore
				: (a[property] ?? 0)
			const valB: string | number = property === "lastActivity"
				? (pTC[b.playerId] ?? []).reduce((p, c) => {
					let lastCharActivity = (c.lastMastered ?? 0) > (c.lastPlayed ?? 0) ? (c.lastMastered ?? 0) : (c.lastPlayed ?? 0)
					return lastCharActivity > p ? lastCharActivity : p
				}, 0)
				// @ts-ignore
				: (b[property] ?? 0)

			if (typeof valA === "number" && typeof valB === "number") {
				return (valA - valB) * newParams.dir
			}
			if (typeof valA === "string" && typeof valB === "string") {
				return valA.localeCompare(valB) * newParams.dir
			}
			return 0
		}))
	}, [sortProperty])

	useEffect(() => {
		setIsTyping(true);
		const timeoutId = setTimeout(() => {
			if(query != null && query.length >= 1) {
				setSortedPlayers(current => current.filter(it => {
					const parsedQuery = query.toLowerCase().replace(" ", "")
					const parsedName = it.name.toLowerCase().replace(" ", "")
					return parsedName.includes(parsedQuery)
				}))
			} else if (players != null) {
				setSortedPlayers([...players])
			}
			setIsTyping(false);
		}, 300);

		return () => clearTimeout(timeoutId)
	}, [players, query])

	return (<Flex mr="2em" ml="2em" direction="column">
		<InputGroup mb="1em">
			<InputLeftAddon><SearchIcon /></InputLeftAddon>
			<Input id="item-search-bar" placeholder="Search" minWidth="75vw" onChange={onChangeFilter}/>
			{isTyping && <InputRightElement><Spinner /></InputRightElement>}
		</InputGroup>
		<Grid templateColumns='repeat(5, 1fr)' gap={6}>
			<GridItem>
				<Flex align="center">
					<Text
						as="b"
						fontSize="xl"
						_hover={{ cursor: "pointer" }}
						onClick={() => onSort("name")}
						mr="0.5em"
					>Name</Text>
					{ sortProperty?.prop === "name" && sortProperty.dir === 1 && <Icon as={TriangleUpIcon} boxSize={4} />}
					{ sortProperty?.prop === "name" && sortProperty.dir === -1 && <Icon as={TriangleDownIcon} boxSize={4} />}
				</Flex>
			</GridItem>
			<GridItem>
				<Flex align="center">
					<Text
						as="b"
						fontSize="xl"
						_hover={{ cursor: "pointer" }}
						onClick={() => onSort("dateJoined")}
						mr="0.5em"
					>Date Joined</Text>
					{ sortProperty?.prop === "dateJoined" && sortProperty.dir === 1 && <Icon as={TriangleUpIcon} boxSize={4} />}
					{ sortProperty?.prop === "dateJoined" && sortProperty.dir === -1 && <Icon as={TriangleDownIcon} boxSize={4} />}
				</Flex>
			</GridItem>
			<GridItem>
				<Flex align="center">
					<Text
						as="b"
						fontSize="xl"
						_hover={{ cursor: "pointer" }}
						onClick={() => onSort("lastActivity")}
						mr="0.5em"
					>Last Activity</Text>
					{ sortProperty?.prop === "lastActivity" && sortProperty.dir === 1 && <Icon as={TriangleUpIcon} boxSize={4} />}
					{ sortProperty?.prop === "lastActivity" && sortProperty.dir === -1 && <Icon as={TriangleDownIcon} boxSize={4} />}
				</Flex>
			</GridItem>
			<GridItem>
				<Flex align="center">
					<Text
						as="b"
						fontSize="xl"
						mr="0.5em"
					>Active Characters</Text>
				</Flex>
			</GridItem>
			<GridItem>
				<Flex align="center">
					<Text
						as="b"
						fontSize="xl"
						mr="0.5em"
					>Master</Text>
				</Flex>
			</GridItem>
			{sortedPlayers.map(it => <PlayerRow key={it.playerId} player={it} characters={pTC[it.playerId] ?? []} />)}
		</Grid>
	</Flex>)
}