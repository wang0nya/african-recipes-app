import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AddRecipePage } from '../add-recipe/add-recipe';
import { RecipeProvider } from "../../providers/recipe/recipe";
import { ProfileProvider } from "../../providers/profile/profile";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
public userProfile: any;
public recipeList: Array<any>;
public tap: number = 0;
  constructor(public navCtrl: NavController, public recipeProvider: RecipeProvider,public profileProvider: ProfileProvider) {
  }
  goToAddRecipe(params){
    if (!params) params = {};
    this.navCtrl.push(AddRecipePage);
  }
  ionViewDidLoad() {
    this.profileProvider.getUserProfile().on("value", userProfileSnapshot => {
      this.userProfile = userProfileSnapshot.val();
    });
    this.recipeProvider.getRecipeList().on("value", recipeListSnapshot => {
      this.recipeList = []; recipeListSnapshot.forEach(snap => {
        this.recipeList.push({
          id: snap.key,
          name: snap.val().name, ingredients: snap.val().ingredients, community: snap.val().community,
          servings: snap.val().servings, method: snap.val().method
        });
        return false;
      });
    });
  }
  tapEvent(e) {
    this.tap++
  }
}
