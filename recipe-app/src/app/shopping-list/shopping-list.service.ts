import { Subject } from 'rxjs';

import { Ingredient } from '../shared/ingredient.model';

export class ShoppingListService {
  ingredientsChanged = new Subject<Ingredient[]>();
  private ingredients: Ingredient[] = [];
  startedEditing = new Subject<number>();

  constructor() {
    this.ingredients = [
      new Ingredient('Bananas', 1),
      new Ingredient('Apples', 2),
    ];
  }

  getIngredients() {
    return this.ingredients.slice();
  }

  getIngredient(index: number) {
    return this.ingredients[index];
  }

  addIngredient(ingredient: Ingredient) {
    console.log(`Ingredient being added: ${JSON.stringify(ingredient)}`);
    this.ingredients.push(ingredient);
    this.notifyIngredientsChanged();
  }

  addIngredients(ingredients: Ingredient[]) {
    this.ingredients.push(...ingredients);
    this.notifyIngredientsChanged();
  }

  updateIngredient(index: number, newIngredient: Ingredient) {
    this.ingredients[index] = newIngredient;
    this.notifyIngredientsChanged();
  }

  deleteIngredient(index: number) {
    this.ingredients = this.ingredients
      .slice(0, index)
      .concat(this.ingredients.slice(index + 1));
    this.notifyIngredientsChanged();
  }

  private notifyIngredientsChanged() {
    this.ingredientsChanged.next(this.ingredients.slice());
  }
}
