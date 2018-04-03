import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content } from 'ionic-angular';
import { RecipeProvider } from "../../providers/recipe/recipe";
import firebase from 'firebase';
import { Reference } from '@firebase/database-types';
import { ProfileProvider } from "../../providers/profile/profile";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import marked from 'marked';
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
  @ViewChild(Content) content: Content;
public currentUserMe: any = {};
public currentRecipe: any = {};
public currentRecipeChef: any = {};
public recipeCommentsList: Array<any>;
public recipeListRef: Reference;
public commentArea: FormGroup;
public likes_sum: number;
// https://stackoverflow.com/questions/42392137/hide-and-show-on-click-in-the-ionic-2
public buttonClicked: boolean = false; //Whatever you want to initialise it as
public onButtonClick() {
  this.buttonClicked = !this.buttonClicked;
}
  constructor(public navCtrl: NavController, public navParams: NavParams,public recipeProvider: RecipeProvider
  , public profileProvider: ProfileProvider, formBuilder: FormBuilder) {
    this.commentArea = formBuilder.group({
        comment: ['', Validators.compose([Validators.minLength(1), Validators.required])]
    });
  }

  ionViewDidLoad() {
    this.recipeProvider.getRecipeDetail(this.navParams.get("recipeId")).on("value", recipeSnapshot => {
      this.currentRecipe = recipeSnapshot.val();
      this.currentRecipeChef = recipeSnapshot.val().chef;
      this.currentRecipe.id = recipeSnapshot.key;
      this.markdownText = marked(recipeSnapshot.val().method.toString())
      this.content = this.markdownText
    });
    this.recipeProvider.getRecipeComments(this.navParams.get("recipeId")).on("value", recipeCommentSnapshot => {
      this.recipeCommentsList = []; recipeCommentSnapshot.forEach(snap => {
        this.recipeCommentsList.push({
          id: snap.key,
          authorFname: snap.val().authorFname, authorLname: snap.val().authorLname,
          authorPic: snap.val().authorPic, recipeComment: snap.val().recipeComment
        });
        return false;
      });
    });
    this.profileProvider.getMyUserProfile().on("value", userSnapshot => {
      this.currentUserMe = userSnapshot.val();
      this.currentUserMe.firstName = userSnapshot.val().profile.firstName;
      this.currentUserMe.lastName = userSnapshot.val().profile.lastName;
      this.currentUserMe.pic = userSnapshot.val().profile.pic;
    });
    console.log('ionViewDidLoad RecipeDetailsPage');
  }
  tapEvent(recipeId) {
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
  commentEvent(recipeId, recipeComment) {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.recipeProvider.recipeListRef.child(`${recipeId}/comments`)
        .push({
          recipeComment,
          authorFname: this.currentUserMe.firstName,
          authorLname: this.currentUserMe.lastName,
          authorPic: this.currentUserMe.pic
        })
      }
    });
  }
}
