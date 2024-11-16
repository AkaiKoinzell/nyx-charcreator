import {
	FormControl,
	FormLabel,
	Input,
	Popover,
	PopoverBody,
	PopoverContent,
	PopoverTrigger,
	SpaceProps,
	useDisclosure,
	Text,
	Flex,
	VStack, InputGroup, InputRightElement, Spinner, Box, Divider, IconButton,
} from '@chakra-ui/react'
import { FormValue } from '../../../models/form/FormValue'
import { generateSkeletons } from '../../ui/StackedSkeleton'
import React, {useCallback, useEffect, useState} from 'react'
import {ItemWithQuantity} from "../../../models/form/ItemWithQuantity";
import {useSearchItemsQuery} from "../../../services/item";
import {ErrorAlert} from "../../ui/ErrorAlert";
import {CloseIcon} from "@chakra-ui/icons";
import {NumberInput} from "./NumberInput";

interface ItemWithQuantitySelectorProps extends SpaceProps {
	label: string
	defaultValue?: ItemWithQuantity[]
	validator?: (input?: ItemWithQuantity[]) => boolean
	valueConsumer?: (value: FormValue<ItemWithQuantity[]>) => void
	invalidLabel?: string,
	placeholder?: string
}

export const ItemWithQuantitySelector = ({
	label,
	defaultValue,
	validator,
	valueConsumer,
	invalidLabel,
	placeholder,
	...style
}: ItemWithQuantitySelectorProps) => {
	const [value, setValue] = useState<FormValue<ItemWithQuantity[]>>({
		value: defaultValue,
		isValid: true,
	});

	const [isTyping, setIsTyping] = useState(false)
	const { isOpen, onOpen: popoverOpen, onClose: popoverClose } = useDisclosure()
	const [inputValue, setInputValue] = useState<string>('')
	const [queryValue, setQueryValue] = useState('')
	const { data, error, isFetching } = useSearchItemsQuery({query: queryValue, limit: 5})

	const handleRemoval = useCallback(
		(item: string) => {
			setValue(currentValue => {
				const filteredItems = [...(currentValue.value ?? [])].filter(it => it.item !== item)
				const isValid = !!validator ? validator(filteredItems) : true
				const newValue = {
					value: filteredItems,
					isValid
				}
				if (!!valueConsumer) {
					valueConsumer(newValue)
				}
				return newValue
			})
		},
		[validator, valueConsumer]
	)

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

	const handleSelection = useCallback(
		(item: string) => {
			const newItem = data?.entities?.find(it => it.name === item)
			setValue(currentValues => {
				if (!!newItem && !currentValues.value?.find(it => it.item === newItem.name)) {
					const newItems =  [
						...(currentValues?.value ?? []),
						{ item: newItem.name, quantity: 1 }
					].sort((a, b) => (a.item < b.item ? -1 : 1))
					const isValid = !!validator ? validator(newItems) : true
					const newValue = {
						value: newItems,
						isValid
					}
					if (!!valueConsumer) {
						valueConsumer(newValue)
					}
					return newValue
				} else {
					return currentValues
				}
			})
			setInputValue('')
		},
		[data?.entities, validator, valueConsumer]
	)

	const onElementClicked = useCallback(
		(item: string) => {
			handleSelection(item)
			popoverClose()
		},
		[handleSelection, popoverClose]
	)

	const onQuantityUpdate = useCallback((item: string, quantity: number) => {
		setValue(currentValues => {
			const foundItem = currentValues.value?.find(it => it.item === item)
			if (!!foundItem) {
				const newItems = [
					...(currentValues.value?.filter(it => it.item !== item) ?? []),
					{ item, quantity }
				].sort((a, b) => (a.item < b.item ? -1 : 1))
				const isValid = !!validator ? validator(newItems) : true
				const newValue = {
					value: newItems,
					isValid
				}
				if (!!valueConsumer) {
					valueConsumer(newValue)
				}
				return newValue
			} else {
				return currentValues
			}
		})
	}, [validator, valueConsumer]);

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

	const validChoices = data?.entities?.filter(it => value.value?.every(itt => itt.item !== it.name) ?? true)

	return (
		<FormControl {...style}>
			{!!label && <FormLabel color={value.isValid ? '' : 'red'}>{label}</FormLabel>}
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
						<Input
							placeholder={placeholder}
							borderColor={value.isValid ? '' : 'red'}
							borderWidth={value.isValid ? '' : '2px'}
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
							{!!validChoices &&
								validChoices.length > 0 &&
								(!inputValue || inputValue.length > 0) &&
								validChoices.map(it => (
									<Box key={it.name} width="full">
										<Flex
											justifyContent="flex-start"
											marginLeft="1em"
											onClick={() => onElementClicked(it.name)}
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
			<Flex padding="0.6em" margin="0px" direction="column">
				{(value.value ?? []).map(itemWithQuantity => (
					<Flex key={itemWithQuantity.item} justifyContent="space-between" alignItems="center">
						<IconButton
							colorScheme="red"
							aria-label="Remove user"
							variant="outline"
							mr="0.6em"
							mt="0.2em"
							size="sm"
							icon={<CloseIcon />}
							onClick={() => {
								handleRemoval(itemWithQuantity.item)
							}}
						/>
						<Text fontSize="lg" ml="0.6em" mt="0.3em" width="100%">
							{itemWithQuantity.item}
						</Text>
						<NumberInput
							label="Quantity"
							min={1}
							valueConsumer={(value) => {
								onQuantityUpdate(itemWithQuantity.item, value.value ?? 1)
							}}
							defaultValue={defaultValue?.find(it => it.item === itemWithQuantity.item)?.quantity}
						/>
					</Flex>
				))}
			</Flex>
			{!value.isValid && !!invalidLabel && (
				<Text fontSize="sm" color="red">
					{invalidLabel}
				</Text>
			)}
		</FormControl>
	)
}
