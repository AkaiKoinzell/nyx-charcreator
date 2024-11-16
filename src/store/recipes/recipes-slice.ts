import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "..";
import {CraftRequirement} from "../../models/item/CraftRequirement";

export interface RecipesState {
	recipes: CraftRequirement[];
}

const initialState: RecipesState = {
	recipes: []
};

const recipesSlice = createSlice({
	name: "recipes",
	initialState: initialState,
	reducers: {
		addRecipe: (state, action: PayloadAction<CraftRequirement>) => {
			state.recipes = [
				...state.recipes.filter(it => it.label !== action.payload.label),
				action.payload
			].sort((a, b) => {
				return ((a.label ?? "") < (b.label ?? "") ? -1 : 1)
			})
		},
		removeRecipe: (state, action: PayloadAction<string>) => {
			state.recipes = state.recipes.filter(it => it.label !== action.payload)
		},
		clearRecipes: (state) => {
			state.recipes = []
		},
		setRecipes: (state, action: PayloadAction<CraftRequirement[]>) => {
			state.recipes = action.payload
		}
	}
});

export const {
	addRecipe,
	removeRecipe,
	clearRecipes,
	setRecipes
} = recipesSlice.actions;

export const recipesReducer = recipesSlice.reducer;

export const recipesSelector = (state: RootState) => state.recipes.recipes;
