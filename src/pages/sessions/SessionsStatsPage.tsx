import {
	Box,
	Button,
	Flex,
	Skeleton,
	Stat,
	StatGroup,
	StatLabel,
	StatNumber,
	Text,
	useBreakpointValue
} from "@chakra-ui/react";
import {DatePicker} from "../../components/form/controls/DatePicker";
import {useCallback, useEffect, useState} from "react";
import {useLazyGetSessionsBetweenDatesQuery} from "../../services/session";
import {SessionStats} from "../../models/session/SessionStats";
import {extractStats} from "../../utils/session-utils";
import {SearchIcon} from "@chakra-ui/icons";
import {useGetPlayersQuery} from "../../services/player";
import {formatDate} from "../../utils/string-utils";
import {Size} from "../../components/form/controls/LabelInput";

const widthForSize: Record<Size, { width: string }> = {
	xl: { width: "10vw" },
	lg: { width: "13vw" },
	md: { width: "16vw" },
	sm: { width: "32vw" },
	base: { width: "32vw" },
}

export const SessionsStatsPage = () => {
	const size = useBreakpointValue<{ width: string }>(widthForSize, {
		fallback: 'md',
	})
	const [startDate, setStartDate] = useState<Date>(new Date(new Date().setMonth(new Date().getMonth() - 1)))
	const [endDate, setEndDate] = useState<Date>(new Date())
	const [getSessions, { data: sessions, isSuccess: sessionsSuccess, isUninitialized: sessionsAreNotInit }] = useLazyGetSessionsBetweenDatesQuery()
	const [stats, setStats] = useState<SessionStats | undefined>(undefined)
	const { data: players, isSuccess: playersSuccess, isUninitialized: playersAreNotInit } = useGetPlayersQuery(
		Object.keys(stats?.masters ?? []),
		{ skip: Object.keys(stats?.masters ?? []).length === 0 }
	)

	useEffect(() => {
		if (sessions != null && sessionsSuccess) {
			setStats(extractStats(sessions))
		}
	}, [sessions, sessionsSuccess]);

	const onSearch = useCallback(() => {
		getSessions({from: startDate.getTime(), to: endDate.getTime()})
	}, [endDate, getSessions, startDate])

	return <Box m="2em">
		<Flex direction="row" alignItems="flex-end" ml="2em">
			<DatePicker
				label="Start date"
				width={size?.width}
				initialDate={new Date(new Date().setMonth(new Date().getMonth() - 1))}
				valueConsumer = { value => {
					if(value.isValid && !!value.value) {
						setStartDate(value.value)
					}
				}}
				mr="1em"
			/>
			<DatePicker
				label="End date"
				width={size?.width}
				initialDate={new Date()}
				valueConsumer = { value => {
					if(value.isValid && !!value.value) {
						setEndDate(value.value)
					}
				}}
				mr="1em"
			/>
			<Button
				colorScheme="blue"
				isDisabled={!startDate || !endDate || endDate < startDate}
				onClick={onSearch}
				leftIcon={<SearchIcon />}
			>Search</Button>
		</Flex>
		<Flex direction="column">
			{!sessionsAreNotInit && <Skeleton isLoaded={sessionsSuccess} mt="2em">
				<Flex direction="column">
					<Text as="b" fontSize="2xl">Tags</Text>
					<StatGroup borderWidth="thin" mt="1em" borderColor="gray.300" p="1em" borderRadius="lg">
						{Object.entries(stats?.tags ?? {}).sort((a, b) => b[1] - a[1]).map(([tag, count]) =>
							<Stat key={tag}>
								<StatLabel>{tag}</StatLabel>
								<StatNumber>{count}</StatNumber>
							</Stat>)}
					</StatGroup>
				</Flex>
			</Skeleton>}
			<Flex>
				{!playersAreNotInit && <Skeleton isLoaded={playersSuccess} mt="2em">
					<Flex direction="column">
						<Text as="b" fontSize="2xl">Masters</Text>
						<StatGroup borderWidth="thin" mt="1em" borderColor="gray.300" p="1em" borderRadius="lg" flexDirection="column" alignItems="start" >
							{Object.entries(stats?.masters ?? {}).sort((a, b) => b[1] - a[1]).map(([master, count]) =>
								<Stat key={master}>
									<StatLabel>{players?.find(it => it.playerId === master)?.name ?? "Unknown master"}</StatLabel>
									<StatNumber>{count}</StatNumber>
								</Stat>)}
						</StatGroup>
					</Flex>
				</Skeleton>}
				{!sessionsAreNotInit && <Skeleton isLoaded={sessionsSuccess} mt="2em" ml="2em">
					<Flex direction="column">
					<Text as="b" fontSize="2xl">Last sessions</Text>
					<StatGroup borderWidth="thin" mt="1em" borderColor="gray.300" p="1em" borderRadius="lg" flexDirection="column" alignItems="start" >
							{[...(sessions ?? [])].reverse().map(it =>
								<Stat key={it.id}>
									<StatLabel>{formatDate(it.date)}</StatLabel>
									<StatNumber>{it.title}</StatNumber>
								</Stat>)}
						</StatGroup>
					</Flex>
				</Skeleton>}
			</Flex>
		</Flex>
	</Box>
}