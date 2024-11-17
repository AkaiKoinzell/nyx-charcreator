import {Form} from "react-router-dom";
import {TextInput} from "../controls/TextInput";
import {CraftRequirement} from "../../../models/item/CraftRequirement";
import {NumberInput} from "../controls/NumberInput";
import {Button, Flex, FormLabel, Switch} from "@chakra-ui/react";
import React, {useCallback, useState} from "react";
import {ItemWithQuantitySelector} from "../controls/ItemWithQuantitySelector";
import {FormValue} from "../../../models/form/FormValue";
import {ControllableNumberInput} from "../controls/ControllableNumberInput";
import {ItemWithQuantity} from "../../../models/form/ItemWithQuantity";
import {useAppDispatch} from "../../../hooks/redux";
import {addRecipe} from "../../../store/recipes/recipes-slice";
import {round} from "../../../utils/number-utils";

interface AddRecipeFormProps {
	recipe?: CraftRequirement,
	onSubmit: () => void
}

type MinMax = {
	min: number,
	max: number
}

export const AddRecipeForm = ({ recipe, onSubmit }: AddRecipeFormProps) => {
	const dispatch = useAppDispatch()

	const [multipleObject, setMultipleObject] = useState(!!recipe ? isMultipleObject(recipe) : false)

	const [recipeName, setRecipeName] = useState<FormValue<string>>({
		value: !!recipe ? (recipe.label ?? "Craft recipe") : undefined,
		isValid: !!recipe
	})
	const [moneyCost, setMoneyCost] = useState<FormValue<number | null>>({
		value: recipe?.cost,
		isValid: true
	})
	const [materials, setMaterials] = useState<FormValue<ItemWithQuantity[]>>({
		value: Object.entries(recipe?.materials ?? []).map((material) => {
			const realQuantity = isMultipleObject(recipe!)
				? round(material[1]) * (recipe?.minQuantity ?? 1)
				: round(material[1])
			return { item: material[0], quantity: realQuantity }
		}),
		isValid: true
	})
	const [realTimeRequired, setRealTimeRequired] = useState<FormValue<number | null>>({
		value: !!recipe?.timeRequired ? recipe.timeRequired / 1000 / 60 / 60 : undefined,
		isValid: true
	})
	const [boundaries, setBoundaries] = useState<FormValue<MinMax>>({
		value: { min: recipe?.minQuantity ?? 1, max: recipe?.maxQuantity ?? 1},
		isValid: true
	})

	const handleSubmit = useCallback(() => {
		const dividerIfMultiple = multipleObject ? (boundaries.value?.min ?? 1) : 1
		dispatch(addRecipe({
			timeRequired: !!realTimeRequired.value ? realTimeRequired.value * 60 * 60 * 1000 : null,
			minQuantity: boundaries.value?.min ?? 1,
			maxQuantity: boundaries.value?.max ?? boundaries.value?.min ?? 1,
			materials: Object.fromEntries(materials.value?.map(it => [it.item, it.quantity / dividerIfMultiple]) ?? []),
			label: recipeName?.value?.trim() ?? "Unnamed recipe",
			cost: moneyCost?.value ?? 0,
			buildings: [],
			tools: []
		}))
		onSubmit()
	}, [boundaries.value?.max, boundaries.value?.min, dispatch, materials.value, moneyCost?.value, multipleObject, onSubmit, realTimeRequired.value, recipeName?.value])

	const isFormValid = recipeName.isValid
		&& moneyCost.isValid
		&& materials.isValid
		&& realTimeRequired.isValid
		&& boundaries.isValid
		&& requiresCost(moneyCost, realTimeRequired, materials)

	return (<Form>
		<TextInput
			label="Recipe name"
			placeholder="E.g. Upgrade"
			valueConsumer={setRecipeName}
			validator={(value) => !!value && value.length > 0}
			invalidLabel="You must specify a recipe name"
			defaultValue={recipeName.value}
		/>
		<ControllableNumberInput
			label="Money cost"
			valueConsumer={setMoneyCost}
			validator={(value) => !value || value >= 0 }
			min={0}
			invalidLabel="Craft cost cannot be less than 0"
			mt="1em"
			defaultValue={!!recipe
				? {
					isEnabled: recipe.cost > 0,
					value: recipe.cost,
				} : undefined
			}
		/>
		<ItemWithQuantitySelector
			label="Materials"
			placeholder="Search another item"
			mt="1em"
			valueConsumer={setMaterials}
			validator={(value) => !value || value?.every(it => it.quantity > 0)}
			defaultValue={!!recipe
				? Object.entries(recipe?.materials ?? []).map((material) => {
					const realQuantity = isMultipleObject(recipe!)
						? round(material[1] * (recipe?.minQuantity ?? 1))
						: round(material[1])
					return { item: material[0], quantity: realQuantity }
				}) : undefined
			}
		/>
		<ControllableNumberInput
			label="Real-life hours required"
			valueConsumer={setRealTimeRequired}
			validator={(value) => !value || value >= 0 }
			mt="1em"
			invalidLabel="Craft time cannot be less than 0"
			defaultValue={!!recipe
				? {
					isEnabled: !!recipe.timeRequired && recipe.timeRequired > 0,
					value: (recipe.timeRequired ?? 0) / 1000 / 60 / 60,
				} : undefined
			}
		/>
		<Flex align="center" mt="1em">
			<Switch isChecked={multipleObject} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {setMultipleObject(event.target.checked)}} />
			<FormLabel mt="0.5em" ml="0.5em">Crafts multiple objects with the same ingredients</FormLabel>
		</Flex>
		{!multipleObject && <Flex>
			<NumberInput
				label="Min quantity"
				formMarginLeft="0px"
				min={1}
				valueConsumer={(value) => {
					if(!!value.value) {
						setBoundaries(current => ({
							value: { ...(current?.value ?? {min: 1, max: 1}), min: value.value! },
							isValid: true
						}))
					}
				}}
				defaultValue={recipe?.minQuantity}
			/>
			<NumberInput
				label="Max quantity"
				formMarginLeft="0px"
				min={1}
				valueConsumer={(value) => {
					if(!!value.value) {
						setBoundaries(current => ({
							value: { ...(current?.value ?? {min: 1, max: 1}), max: value.value! },
							isValid: true
						}))
					}
				}}
                defaultValue={recipe?.maxQuantity}
			/>
		</Flex>}
		{multipleObject && <NumberInput
			label="Craft quantity"
			formMarginLeft="0px"
			min={1}
			valueConsumer={(value) => {
				if(!!value.value) {
					setBoundaries(current => ({
						value: { ...(current?.value ?? {min: 1, max: 1}), max: value.value!, min: value.value! },
						isValid: true
					}))
				}
			}}
            defaultValue={recipe?.minQuantity}
		/>}
		<Button
			isDisabled={!isFormValid}
			onClick={handleSubmit}
		>
			Save recipe
		</Button>
	</Form>);
}

function isMultipleObject(recipe: CraftRequirement): boolean {
	return !!recipe.minQuantity && recipe.maxQuantity === recipe.minQuantity
}

function requiresCost(moneyCost: FormValue<number | null>, timeCost: FormValue<number | null>, materialCost: FormValue<ItemWithQuantity[]>): boolean {
	return (moneyCost.value ?? 0) > 0 || (timeCost.value ?? 0) > 0 || (materialCost.value?.some(it => it.quantity > 0) ?? false)
}