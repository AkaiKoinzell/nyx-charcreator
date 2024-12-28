import {Button, Card, CardBody, CardHeader, Center, Flex, Heading, Spinner, Text} from "@chakra-ui/react";
import {CharacterInput} from "../controls/CharacterInput";
import {Character} from "../../../models/character/Character";
import {Player} from "../../../models/player/Player";
import {FormValue} from "../../../models/form/FormValue";
import {Label} from "../../../models/label/Label";
import {LabelInput} from "../controls/LabelInput";
import {useCallback, useEffect, useState} from "react";
import {LabelStub} from "../../../models/label/LabelStub";
import {useLazyListItemIdsQuery} from "../../../services/item";
import {RepeatIcon} from "@chakra-ui/icons";
import {random} from "../../../utils/array-utils";

interface GiveRandomItemFormProps {
	characters?: Character<Player>[],
	itemLabels: Label[],
	onSubmit: (character: Character<Player>, itemName: string) => void
}

export const GiveRandomItemForm = ({
	characters,
	itemLabels,
	onSubmit
} : GiveRandomItemFormProps) => {
	const [character, setCharacter] = useState<FormValue<Character<Player>>>({
		value: undefined,
		isValid: false
	})
	console.log(character)
	const [labels, setLabels] = useState<FormValue<LabelStub[]>>({
		value: [],
		isValid: true
	})
	const [currentItem, setCurrentItem] = useState<string | undefined>(undefined)
	const [searchItems, { data: itemNames, error, isSuccess, isLoading }] = useLazyListItemIdsQuery()

	const getRandomItem = useCallback(() => {
		searchItems({labels: labels.value})
		if (!isLoading && !!itemNames) {
			setCurrentItem(random(itemNames))
		}
	}, [isLoading, itemNames, labels.value, searchItems])

	useEffect(() => {
		if(!!itemNames && isSuccess) {
			setCurrentItem(random(itemNames))
		}
	}, [isSuccess, itemNames]);

	return (
		<Card width="50vw">
			<CardHeader>
				<Heading>Give a Random Item</Heading>
			</CardHeader>
			<CardBody>
				<CharacterInput
					label="Character"
					placeholder="Select a character"
					characters={characters}
					validator={(input?: Character<Player>[]) =>
						!!input && input.length > 0
					}
					valueConsumer={setCharacter}
					invalidLabel={"You must choose a valid character"}
				/>
				<LabelInput
					label="Item Labels"
					placeholder="Choose 0 or more labels"
					labels={itemLabels ?? []}
					valueConsumer={value => {
						setLabels({
							value: value.value?.map(it => ({ id: it.id, name: it.name })),
							isValid: value.isValid
						})
						setCurrentItem(undefined)
					}}
					mt="1em"
					mb="1em"
				/>
				<Flex alignItems="center" >
					<Button
						colorScheme="blue"
						leftIcon={<RepeatIcon />}
						onClick={getRandomItem}
						isDisabled={!labels.isValid}
					>Generate</Button>
					<Flex ml="1em">
						{!currentItem && !error && !isLoading && <Text color="gray">Press the button to randomly select an item</Text>}
						{isLoading && <Flex>
							<Spinner color='gray' mr="1em"/>
							<Text color="gray">Generating...</Text>
						</Flex>}
						{!!currentItem && !error && <Text color="black">{currentItem}</Text>}
						{!!error && <Text color="red">{JSON.stringify(error)}</Text>}
					</Flex>
				</Flex>
				<Center mt="1em">
					<Button
						colorScheme="blue"
						onClick={() => {
							if(!!character.value && !!currentItem) {
								onSubmit(character.value, currentItem)
							}
						}}
						isDisabled={!currentItem || !character.isValid || !character.value}
					>Assign</Button>
				</Center>
			</CardBody>
		</Card>
	);
}