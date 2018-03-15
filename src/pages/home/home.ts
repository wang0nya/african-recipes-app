import { Component} from '@angular/core';
import { NavController } from 'ionic-angular';
import { AddRecipePage } from '../add-recipe/add-recipe';
import { RecipeProvider } from "../../providers/recipe/recipe";
import { ProfileProvider } from "../../providers/profile/profile";
import { RecipeDetailsPage } from '../recipe-details/recipe-details';
import firebase from 'firebase';
import { Reference, ThenableReference } from '@firebase/database-types';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
public recipeListRef: Reference;
public userProfile: any;
public recipeList: Array<any>;
storageRef: any;
imageRef: any;
  constructor(public navCtrl: NavController, public recipeProvider: RecipeProvider,public profileProvider: ProfileProvider
  ) {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.storageRef = firebase.storage().ref();
        this.imageRef = this.storageRef.child(`${user.uid}/pp.jpg`);
      }
    });
  }
  goToAddRecipe(params){
    if (!params) params = {};
    this.navCtrl.push(AddRecipePage);
  }
  goToRecipeDetails(recipeId):void{
    this.navCtrl.push(RecipeDetailsPage, {recipeId: recipeId});
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
          servings: snap.val().servings, method: snap.val().method, pic: snap.val().pic, likes: snap.val().likes
        });
        return false;
      });
    });
  }
}
