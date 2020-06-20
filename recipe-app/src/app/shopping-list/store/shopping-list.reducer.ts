import { Ingredient } from '../../shared/ingredient.model';
import * as shoppingListActions from './shopping-list.actions';

export interface ShoppingListState {
  ingredients: Ingredient[];
  editedIngredient: Ingredient;
  editedIngredientIndex: number;
}

export interface AppState {
  shoppingList: ShoppingListState;
}

const INITIAL_STATE: ShoppingListState = {
  ingredients: [new Ingredient('Bananas', 1), new Ingredient('Apples', 2)],
  editedIngredient: null,
  editedIngredientIndex: -1,
};

export function shoppingListReducer(
  state: ShoppingListState = INITIAL_STATE,
  action: shoppingListActions.ShoppingListAction
) {
  switch (action.type) {
    case shoppingListActions.ADD_INGREDIENT:
      return {
        ...state,
        ingredients: [...state.ingredients, action.payload],
      };
    case shoppingListActions.ADD_INGREDIENTS:
      return {
        ...state,
        ingredients: [...state.ingredients, ...action.payload],
      };
    case shoppingListActions.UPDATE_INGREDIENT:
      return {
        ...state,
        ingredients: [
          ...state.ingredients.slice(0, state.editedIngredientIndex),
          action.payload,
          ...state.ingredients.slice(state.editedIngredientIndex + 1),
        ],
        editedIngredient: null,
        editedIngredientIndex: -1,
      };
    case shoppingListActions.DELETE_INGREDIENT:
      return {
        ...state,
        ingredients: [
          ...state.ingredients.slice(0, state.editedIngredientIndex),
          ...state.ingredients.slice(state.editedIngredientIndex + 1),
        ],
        editedIngredient: null,
        editedIngredientIndex: -1,
      };
    case shoppingListActions.START_EDIT:
      return {
        ...state,
        editedIngredientIndex: action.payload,
        editedIngredient: { ...state.ingredients[action.payload] },
      };
    case shoppingListActions.STOP_EDIT:
      return {
        ...state,
        editedIngredientIndex: -1,
        editedIngredient: null,
      };
    default:
      return state;
  }
}
