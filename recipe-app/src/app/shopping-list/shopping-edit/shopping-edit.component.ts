import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Ingredient } from 'src/app/shared/ingredient.model';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromShoppingList from '../store/shopping-list.reducer';
import * as ShoppingListActions from '../store/shopping-list.actions';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css'],
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('f', { static: false }) shoppingEditForm: NgForm;
  startedEditingSubscription: Subscription;
  editMode = false;
  editedItem: Ingredient;

  constructor(private store: Store<fromShoppingList.AppState>) {}

  ngOnInit(): void {
    this.startedEditingSubscription = this.store
      .select('shoppingList')
      .subscribe((stateData) => {
        if (stateData.editedIngredientIndex > -1) {
          this.editMode = true;
          this.editedItem = stateData.editedIngredient;
          this.shoppingEditForm.setValue({
            name: this.editedItem.name,
            amount: this.editedItem.amount,
          });
        } else {
          this.editMode = false;
        }
      });
  }

  ngOnDestroy() {
    this.store.dispatch(new ShoppingListActions.StopEdit());
    this.startedEditingSubscription.unsubscribe();
  }

  onSubmit() {
    const value = this.shoppingEditForm.value;
    const ingredient = new Ingredient(value.name, value.amount);
    if (this.editMode) {
      this.store.dispatch(new ShoppingListActions.UpdateIngredient(ingredient));
      /* this.shoppingListService.updateIngredient(
        this.editedItemIndex,
        ingredient
      ); */
    } else {
      // this.shoppingListService.addIngredient(ingredient);
      this.store.dispatch(new ShoppingListActions.AddIngredient(ingredient));
    }
    this.shoppingEditForm.reset();
    this.editMode = false;
    this.editedItem = null;
  }

  onClear() {
    this.store.dispatch(new ShoppingListActions.StopEdit());
    this.shoppingEditForm.reset();

    this.editMode = false;
    this.editedItem = null;
  }

  onDelete() {
    if (this.editMode) {
      this.store.dispatch(new ShoppingListActions.DeleteIngredient());
    }
    this.onClear();
  }
}
