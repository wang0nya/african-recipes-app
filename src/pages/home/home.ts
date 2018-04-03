import { Component} from '@angular/core';
import { NavController } from 'ionic-angular';
import { AddRecipePage } from '../add-recipe/add-recipe';
import { RecipeProvider } from "../../providers/recipe/recipe";
import { ProfileProvider } from "../../providers/profile/profile";
import { RecipeDetailsPage } from '../recipe-details/recipe-details';
import firebase from 'firebase';
import { Reference } from '@firebase/database-types';

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
        this.imageRef = this.storageRef.child(`${user.uid}/pROFILEpic.jpg`);
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
          comments_count: snap.val().comments_count, likes_count: snap.val().likes_count, pic: snap.val().pic, likes: snap.val().likes,
          firstName: snap.val().chef.firstName, lastName: snap.val().chef.lastName, ppic: snap.val().chef.pic
        });
        return false;
      });
    });
    this.followed();
  }
  followed(): void {
    this.profileProvider.userProfileFollowed
    .once("value",snapshot => {
    const userData = snapshot.val();
    if (userData){
      console.log("you followed these guys:", userData);
    }
    else {
      console.log("something went wrong...");
    }
  });
  }
}
