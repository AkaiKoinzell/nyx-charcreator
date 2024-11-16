import {Item} from "../../../models/item/Item";
import {
	Button,
	Card,
	CardBody,
	CardFooter,
	CardHeader, Center,
	Flex, FormLabel,
	Heading, IconButton,
	Modal, ModalBody, ModalCloseButton,
	ModalContent, ModalHeader,
	ModalOverlay, Text, useDisclosure
} from "@chakra-ui/react";
import {TextInput} from "../controls/TextInput";
import {ControllableNumberInput} from "../controls/ControllableNumberInput";
import {FormValue} from "../../../models/form/FormValue";
import {SwitchInput} from "../controls/SwitchInput";
import {SourceSelector} from "../controls/SourceSelector";
import {LabelInput} from "../controls/LabelInput";
import {AddRecipeForm} from "./AddRecipeForm";
import {useAppDispatch, useAppSelector} from "../../../hooks/redux";
import {useEffect, useState} from "react";
import {clearRecipes, recipesSelector} from "../../../store/recipes/recipes-slice";
import {EditIcon} from "@chakra-ui/icons";
import {CraftRequirement} from "../../../models/item/CraftRequirement";
import {ManualSource} from "../../../models/item/ManualSource";
import {Label} from "../../../models/label/Label";
import {LabelStub} from "../../../models/label/LabelStub";

const testSources: ManualSource[] = [ {name: "None", abbreviation: "None"}, {name: "Basic", abbreviation: "PHB"}]

interface AddItemFormProps {
	initialState?: Item,
	itemLabels: Label[]
}

export const AddItemForm = ({ initialState, itemLabels }: AddItemFormProps)  => {
	const dispatch = useAppDispatch()
	const recipes = useAppSelector(recipesSelector)

	useEffect(() => {
		dispatch(clearRecipes())
	}, [dispatch]);

	const { onOpen: recipeModalOpen, onClose: recipeModalClose, isOpen: recipeModalIsOpen } = useDisclosure()
	const [currentRecipe, setCurrentRecipe] = useState<CraftRequirement | undefined>(undefined)

	const [itemName, setItemName] = useState<FormValue<string>>({
		value: initialState?.name,
		isValid: !!initialState
	})
	const [sellPrice, setSellPrice] = useState<FormValue<number | null>>({
		value: initialState?.sell?.cost,
		isValid: true
	})
	const [buyPrice, setBuyPrice] = useState<FormValue<number | null>>({
		value: initialState?.buy?.cost,
		isValid: true
	})
	const [isUsable, setIsUsable] = useState<FormValue<boolean>>({
		value: initialState?.usable ?? false,
		isValid: true
	})
	const [attunement, setAttunement] = useState<FormValue<boolean>>({
		value: initialState?.attunement ?? false,
		isValid: true
	})
	const [sourceLink, setSourceLink] = useState<FormValue<string>>({
		value: initialState?.link ?? undefined,
		isValid: true
	})
	const [labels, setLabels] = useState<FormValue<LabelStub[]>>({
		value: initialState?.labels ?? undefined,
		isValid: true
	})
	return (
		<Card width="90vw" marginLeft="5vw">
			<CardHeader>
				<Heading>{!!initialState ? `Update ${initialState.name}` : "Add a new Item"}</Heading>
			</CardHeader>
			<CardBody>
				<TextInput
					label="Name"
					placeholder="Item name"
					validator={(input?: string) => !!input && input.length > 0}
					valueConsumer={setItemName}
					invalidLabel={"Name cannot be empty"}
					defaultValue={initialState?.name}
				/>
				<Flex mt="1em" align="center">
					<ControllableNumberInput
						label="Sell price"
						valueConsumer={setSellPrice}
						defaultValue={!!initialState?.sell?.cost
							? {
								isEnabled: initialState.sell.cost > 0,
								value: initialState.sell.cost,
							} : undefined
						}
					/>
					<ControllableNumberInput
						label="Buy price"
						valueConsumer={setBuyPrice}
						defaultValue={!!initialState?.buy?.cost
							? {
								isEnabled: initialState.buy.cost > 0,
								value: initialState.buy.cost,
							} : undefined
						}
					/>
					<SwitchInput
						label="Usable"
						defaultValue={initialState?.usable ?? false}
						valueConsumer={setIsUsable}
					/>
					<SwitchInput
						label="Requires attunement"
						defaultValue={initialState?.attunement ?? false}
						valueConsumer={setAttunement}
					/>
				</Flex>
				<Flex mt="1em" align="center">
					<TextInput
						label="Link"
						placeholder="5e tools link (optional)"
						defaultValue={initialState?.link ?? undefined}
						valueConsumer={setSourceLink}
						pr="1em"
					/>
					<SourceSelector
						label="Manual"
						placeholder="None"
						manuals={testSources}
						defaultValue={!!initialState?.manual
							? testSources.find(it => it.abbreviation === initialState.manual)
							: undefined
						}
					/>
				</Flex>
				<LabelInput
					label="Item Labels"
					placeholder="Choose 0 or more labels"
					labels={itemLabels ?? []}
					defaultValue={itemLabels.filter(it =>
						initialState?.labels?.some(itt => itt.id === it.id) ?? false
					)}
					valueConsumer={value => {
						setLabels({
							value: value.value?.map(it => ({ id: it.id, name: it.name })),
							isValid: value.isValid
						})
					}}
					mt="1em"
				/>
				<FormLabel>Crafting Recipes</FormLabel>
				<Flex direction="column">
					{recipes.map((recipe, idx) =>
						<Flex
							key={recipe.label ?? idx}
							onMouseEnter={() => { setCurrentRecipe(recipe) }}
							onMouseLeave={() => { setCurrentRecipe(undefined) }}
							mb="1em"
						>
							<IconButton
								colorScheme='blue'
								aria-label='Edit recipe'
								icon={<EditIcon />}
								onClick={recipeModalOpen}
							/>
							<Flex direction="column" ml="1em">
								<Heading size="md">{recipe.label ?? `Craft recipe ${idx}`}</Heading>
								<Text>{craftRequirementsTextDescription(recipe)}</Text>
							</Flex>
						</Flex>
					)}
				</Flex>
				<Button onClick={recipeModalOpen}>Add a Recipe</Button>
			</CardBody>
			<CardFooter>
				<Button
					colorScheme='blue'
					isDisabled={!itemName.isValid}
				>
					{!!initialState ? "Update item" : "Add item"}
				</Button>
			</CardFooter>
			<Modal isOpen={recipeModalIsOpen} onClose={recipeModalClose}>
				<ModalOverlay />
				<ModalContent maxW="50vw">
					<ModalHeader pb="0px">
						<Center>
							<Heading size={'lg'}>Add recipe</Heading>
						</Center>
					</ModalHeader>
					<ModalCloseButton />
					<ModalBody paddingBottom="1em">
						<AddRecipeForm onSubmit={recipeModalClose} recipe={currentRecipe}/>
					</ModalBody>
				</ModalContent>
			</Modal>
		</Card>
	);
}

function craftRequirementsTextDescription(recipe: CraftRequirement): string {
	const money = !!recipe.cost ? `${recipe.cost} MO` : ""
	const time = !!recipe.timeRequired ? `${recipe.timeRequired / 60 / 60 / 1000} hours` : ""
	const items = Object.entries(recipe.materials)
	const firstItem = items.length >= 1 ? `${items[0][1]}x ${items[0][0]}` : ""
	const otherItems = items.length >= 2 ? `${items.length - 1} other items` : ""
	return [money, time, firstItem, otherItems].filter(it => it.length !== 0).join(", ")
}