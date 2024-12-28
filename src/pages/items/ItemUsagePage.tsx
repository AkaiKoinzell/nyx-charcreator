import {
	Box, Divider, Flex, FormControl, FormLabel,
	Input,
	InputGroup,
	InputLeftAddon,
	InputRightElement,
	Popover, PopoverBody,
	PopoverContent,
	PopoverTrigger, SimpleGrid,
	Spinner, Switch, Text, useBreakpointValue, useDisclosure, VStack
} from "@chakra-ui/react";
import {SearchIcon} from "@chakra-ui/icons";
import React, {useCallback, useEffect, useState} from "react";
import {generateSkeletons, StackedSkeleton} from "../../components/ui/StackedSkeleton";
import {ErrorAlert} from "../../components/ui/ErrorAlert";
import {useLazyFindUsageQuery, useSearchItemsQuery} from "../../services/item";
import {CharacterCard} from "../../components/character/CharacterCard";
import {Size} from "../../components/form/controls/LabelInput";

const cardsForSize: Record<Size, { cards: number }> = {
	xl: { cards: 4 },
	lg: { cards: 3 },
	md: { cards: 2 },
	sm: { cards: 1 },
	base: { cards: 1 },
}

export const ItemUsagePage = () => {
	const size = useBreakpointValue<{ cards: number }>(cardsForSize, {
		fallback: 'md',
	})
	const [isTyping, setIsTyping] = useState(false)
	const [onlyActive, setOnlyActive] = useState(true)
	const { isOpen, onOpen: popoverOpen, onClose: popoverClose } = useDisclosure()
	const [inputValue, setInputValue] = useState<string>('')
	const [queryValue, setQueryValue] = useState('')
	const { data: items, error, isFetching } = useSearchItemsQuery({query: queryValue, limit: 5})
	const [findUsage, {data: characters, error: characterError, isLoading: charactersLoading }] = useLazyFindUsageQuery()

	const handleChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			if (!isOpen) {
				popoverOpen()
			}
			const trimmedValue = e.target.value.trim()
			if (trimmedValue.length > 0) {
				setInputValue(e.target.value)
			} else {
				setInputValue('')
			}
		},
		[isOpen, popoverOpen]
	)

	const onElementClicked = useCallback(
		(item: string) => {
			setInputValue(item)
			findUsage({ item, onlyActive })
			popoverClose()
		},
		[setInputValue, findUsage, onlyActive, popoverClose]
	)

	const onSwitch = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			setOnlyActive(event.target.checked)
			findUsage({ item: inputValue, onlyActive: event.target.checked })
		},
		[findUsage, inputValue]
	)

	useEffect(() => {
		setIsTyping(true)
		const timeoutId = setTimeout(() => {
			if (!!inputValue && inputValue.trim().length > 0) {
				setQueryValue(inputValue.trim())
			}
			setIsTyping(false)
		}, 300)

		return () => clearTimeout(timeoutId)
	}, [inputValue, setQueryValue, setIsTyping])

	return (<Box ml="2vw" mr="2vw">
		<Popover
			closeOnBlur={false}
			closeOnEsc={true}
			isOpen={isOpen}
			onOpen={popoverOpen}
			onClose={popoverClose}
			autoFocus={false}
		>
			<PopoverTrigger>
				<InputGroup>
					<InputLeftAddon><SearchIcon /></InputLeftAddon>
					<Input
						placeholder="Search an item"
						value={inputValue}
						onChange={handleChange}
						onBlur={popoverClose}
					/>
					{isTyping && (
						<InputRightElement>
							<Spinner />
						</InputRightElement>
					)}
				</InputGroup>
			</PopoverTrigger>
			<PopoverContent width="100%">
				<PopoverBody width="70vw">
					<VStack align="flex-start">
						{!!items &&
							items.entities.length > 0 &&
							(!inputValue || inputValue.length > 0) &&
							items.entities.map(it => (
								<Box key={it.name} width="full">
									<Flex
										justifyContent="flex-start"
										marginLeft="1em"
										onClick={() => { onElementClicked(it.name) }}
										width="full"
										_hover={{ cursor: 'pointer' }}
									>
										<Text>{it.name}</Text>
									</Flex>
									<Divider mt="0.5em" ml="1em" width="98%" />
								</Box>
							))}
						{isFetching && generateSkeletons({ quantity: 5, height: '1.5ex' })}
						{!!error && <ErrorAlert info={{ label: 'Cannot load materials', reason: error }} />}
					</VStack>
				</PopoverBody>
			</PopoverContent>
		</Popover>
		<FormControl>
			<Flex align="center">
				<Switch isChecked={onlyActive} onChange={onSwitch} />
				<FormLabel mt="0.5em" ml="0.5em">Exclude inactive characters</FormLabel>
			</Flex>
		</FormControl>
		{charactersLoading && <StackedSkeleton quantity={5} height="3em" />}
		{!!characters && !characterError &&
			<Flex direction="column">
				<Text as="b" mb="0.5em">Total: {characters.length}</Text>
				<SimpleGrid columns={size?.cards ?? 3} spacing={2}>
					{characters.length > 0 && characters.map(it => <CharacterCard key={it.id} character={it} linkToProfile={false}/>)}
				</SimpleGrid>
			</Flex>
		}
	</Box>)
}