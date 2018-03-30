import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { RecipeProvider } from "../../providers/recipe/recipe";
import firebase from 'firebase';
import { Reference } from '@firebase/database-types';

/**
 * Generated class for the RecipeDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  segment: 'recipe-details/:recipeId'
})
@Component({
  selector: 'page-recipe-details',
  templateUrl: 'recipe-details.html',
})
export class RecipeDetailsPage {
public currentRecipe: any = {};
public likes: number = 0;
public recipeListRef: Reference;

  constructor(public navCtrl: NavController, public navParams: NavParams,public recipeProvider: RecipeProvider) {

  }

  ionViewDidLoad() {
    this.recipeProvider.getRecipeDetail(this.navParams.get("recipeId")).on("value", recipeSnapshot => {
      this.currentRecipe = recipeSnapshot.val();
      this.currentRecipe.id = recipeSnapshot.key;
    });
    console.log('ionViewDidLoad RecipeDetailsPage');
  }
  tapEvent(recipeId, likes: number) {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.recipeProvider.recipeListRef.child(`${recipeId}/likes/${user.uid}`)
        .once("value",snapshot => {
        const userData = snapshot.val();
        if (userData){
          console.log("exists!");
          }
        else {
          console.log("zilch!")
          this.recipeProvider.recipeListRef.child(`${recipeId}/likes/${user.uid}`)
          .set({
            count:1
          })
        }
        });
      }
    });
  }
}
