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
import {clearRecipes, recipesSelector, removeRecipe, setRecipes} from "../../../store/recipes/recipes-slice";
import {DeleteIcon, EditIcon} from "@chakra-ui/icons";
import {CraftRequirement} from "../../../models/item/CraftRequirement";
import {ManualSource} from "../../../models/item/ManualSource";
import {Label} from "../../../models/label/Label";
import {LabelStub} from "../../../models/label/LabelStub";
import {useCreateItemMutation, useUpdateItemMutation} from "../../../services/item";
import {ErrorAlertWithNavigation} from "../../ui/ErrorAlertWithNavigation";
import {SuccessAlertWithNavigation} from "../../ui/SuccessAlertWithNaviagion";

interface AddItemFormProps {
	initialState?: Item,
	itemLabels: Label[],
	manualSources: ManualSource[]
}

export const AddItemForm = ({ initialState, itemLabels, manualSources }: AddItemFormProps)  => {
	const dispatch = useAppDispatch()
	const recipes = useAppSelector(recipesSelector)

	const [createItem, { isLoading: createIsLoading, error: createError, isSuccess: createSuccess }] = useCreateItemMutation()
	const [updateItem, { isLoading: updateIsLoading, error: updateError, isSuccess: updateSuccess}] = useUpdateItemMutation()

	useEffect(() => {
		if(!!initialState) {
			dispatch(setRecipes(initialState.craft ?? []))
		} else {
			dispatch(clearRecipes())
		}
	}, [dispatch, initialState]);

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
	const [manual, setManual] = useState<FormValue<ManualSource>>({
		value: !!initialState?.manual ? manualSources.find(it => it.abbreviation === initialState.manual) : undefined,
		isValid: true
	})
	const [labels, setLabels] = useState<FormValue<LabelStub[]>>({
		value: initialState?.labels ?? undefined,
		isValid: true
	})

	const onSubmit = () => {
		const item: Item = {
			name: itemName.value!.trim(),
			sell: sellPrice.value && sellPrice.value  > 0 ? { cost: sellPrice.value, buildings: [], tools: [] } : undefined,
			buy: buyPrice.value && buyPrice.value  > 0 ? { cost: buyPrice.value, buildings: [], tools: [] } : undefined,
			usable: !!isUsable.value,
			attunement: !!attunement.value,
			link: sourceLink.value ?? null,
			manual: manual.value?.name ?? null,
			giveRatio: 1,
			craft: recipes,
			labels: labels.value ?? []
		}
		if (!!initialState) {
			updateItem({
				item: item,
				originalName: initialState.name,
			})
		} else {
			createItem(item)
		}
	}

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
						min={0}
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
						min={0}
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
						manuals={manualSources}
						defaultValue={!!initialState?.manual
							? manualSources.find(it => it.abbreviation === initialState.manual)
							: undefined
						}
						valueConsumer={setManual}
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
					mb="1em"
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
								colorScheme='red'
								aria-label='Delete recipe'
								icon={<DeleteIcon />}
								onClick={() => {
									dispatch(removeRecipe(recipe.label ?? ""))
								}}
								mr="0.5em"
							/>
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
					isLoading={createIsLoading || updateIsLoading}
					onClick={onSubmit}
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
			<ErrorAlertWithNavigation show={!!createError} navigateTo="/" description={`Something went wrong: ${JSON.stringify(createError)}`} />
			<ErrorAlertWithNavigation show={!!updateError} navigateTo="/item/list" description={`Something went wrong: ${JSON.stringify(updateError)}`} />
			<SuccessAlertWithNavigation show={createSuccess} navigateTo="/" description="Item created succesfully" />
			<SuccessAlertWithNavigation show={updateSuccess} navigateTo="/item/list" description="Item updated succesfully" />
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