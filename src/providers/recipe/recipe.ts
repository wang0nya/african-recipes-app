import { Injectable } from '@angular/core';
import { Reference, ThenableReference } from '@firebase/database-types';
import firebase from 'firebase';

/*
  Generated class for the RecipeProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class RecipeProvider {
  public recipeListRef: Reference;
  constructor() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.recipeListRef = firebase
          .database().ref(`/recipeList`);
      }
    });
  }
  createRecipe(recipeName: string, recipeIngredients: string, recipeCommunity: string,
    recipeServings: number, recipeMethod: string, currentUserMe): ThenableReference {
    return this.recipeListRef.push({
      name: recipeName,
      ingredients: recipeIngredients,
      community: recipeCommunity,
      servings: recipeServings,
      method: recipeMethod,
      chef: currentUserMe,
      likes: "0"
    });
  }
  getRecipeList(): Reference {
    return this.recipeListRef;
  }
  getRecipeDetail(recipeId: string): Reference {
    return this.recipeListRef.child(recipeId);
  }
  getRecipeComments(recipeId: string): Reference {
    return this.recipeListRef.child(recipeId+'/comments');
  }
}
