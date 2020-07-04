import { Recipe } from '../recipe.model';
import * as RecipesActions from './recipes.actions';

export interface RecipeState {
  recipes: Recipe[];
}

const initialState: RecipeState = {
  recipes: [],
};

export function recipesReducer(
  state = initialState,
  action: RecipesActions.RecipesActions
) {
  switch (action.type) {
    case RecipesActions.SET_RECIPES:
      return {
        ...state,
        recipes: action.payload,
      };
    case RecipesActions.ADD_RECIPE:
      const id = state.recipes.length + 1;
      const recipe = {
        ...action.payload,
        id,
      };
      return {
        ...state,
        recipes: [...state.recipes, recipe],
      };
    case RecipesActions.UPDATE_RECIPE:
      const actualIndex = state.recipes.findIndex(
        (recipe) => recipe.id === action.payload.index
      );
      return {
        ...state,
        recipes: [
          ...state.recipes.slice(0, actualIndex),
          action.payload.newRecipe,
          ...state.recipes.slice(actualIndex + 1),
        ],
      };
    case RecipesActions.DELETE_RECIPE:
      return {
        ...state,
        recipes: state.recipes.filter((recipe) => recipe.id !== action.payload),
      };
    default:
      return state;
  }
}
