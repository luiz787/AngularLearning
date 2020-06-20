import { Injectable } from '@angular/core';
import { Recipe } from './recipe.model';
import { Ingredient } from '../shared/ingredient.model';
import { Subject } from 'rxjs';
import { Store } from '@ngrx/store';
import * as ShoppingListActions from '../shopping-list/store/shopping-list.actions';
import * as fromShoppingList from '../shopping-list/store/shopping-list.reducer';

@Injectable()
export class RecipeService {
  recipesChanged = new Subject<Recipe[]>();
  private recipes: Recipe[] = [];

  constructor(private store: Store<fromShoppingList.AppState>) {}

  setRecipes(recipes: Recipe[]) {
    this.recipes = recipes;
    this.notifyRecipesChanged();
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]) {
    this.store.dispatch(new ShoppingListActions.AddIngredients(ingredients));
  }

  getRecipes() {
    return this.recipes.slice();
  }

  getRecipeById(id: number): Recipe {
    return this.recipes.find((recipe) => recipe.id === id);
  }

  addRecipe(recipe: Recipe) {
    this.recipes.push(recipe);
    this.notifyRecipesChanged();
  }

  deleteRecipe(id: number) {
    this.recipes = this.recipes.filter((recipe) => recipe.id !== id);
    this.notifyRecipesChanged();
  }

  updateRecipe(id: number, newRecipe: Recipe) {
    const actualIndex = this.recipes.findIndex((recipe) => recipe.id === id);
    if (actualIndex !== -1) {
      this.recipes[actualIndex] = newRecipe;
      this.notifyRecipesChanged();
    }
  }

  private notifyRecipesChanged() {
    this.recipesChanged.next(this.recipes.slice());
  }
}
