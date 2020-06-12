import { Injectable } from '@angular/core';
import { Recipe } from './recipe.model';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import { Subject } from 'rxjs';

@Injectable()
export class RecipeService {
  recipesChanged = new Subject<Recipe[]>();
  private recipes: Recipe[] = [];

  constructor(private shoppingListService: ShoppingListService) {
    this.recipes = [
      new Recipe(
        1,
        'Bolo de cenoura',
        'Bolo da vovó',
        'https://img.cybercook.com.br/receitas/975/bolo-de-cenoura-31-623x350.jpeg',
        [
          new Ingredient('Cenouras', 3),
          new Ingredient('Ovos', 2),
          new Ingredient('Bombons de chocolate', 3),
        ]
      ),
      new Recipe(
        2,
        'Bife a parmegiana',
        'Bife muito gostoso para comer no almoço',
        'https://www.receitasnestle.com.br/images/default-source/recipes/bife_a_parmegiana_alta.jpg?sfvrsn=32461fd_0',
        [
          new Ingredient('Bife', 1),
          new Ingredient('Mussarela', 2),
          new Ingredient('Cebolas', 3),
        ]
      ),
    ];
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]) {
    this.shoppingListService.addIngredients(ingredients);
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
