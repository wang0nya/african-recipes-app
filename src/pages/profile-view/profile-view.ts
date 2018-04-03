import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ProfileProvider } from "../../providers/profile/profile";
import { RecipeProvider } from "../../providers/recipe/recipe";
import { RecipeDetailsPage } from '../recipe-details/recipe-details';

/**
 * Generated class for the ProfileViewPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

 @IonicPage({
   segment: 'profile-view/:userId'
 })
 @Component({
  selector: 'page-profile-view',
  templateUrl: 'profile-view.html',
})
export class ProfileViewPage {
  userData: any;
  me: any;
  public recipeList: Array<any>;
  public userId: string;
  public currentUser: any = {};
  public currentUserMe: any = {};
  constructor(public navCtrl: NavController, public navParams: NavParams, public profileProvider: ProfileProvider
  ,public recipeProvider: RecipeProvider) {

  }

  ionViewDidLoad() {
    this.profileProvider.getUserDetail(this.navParams.get("userId")).on("value", userSnapshot => {
      this.currentUser = userSnapshot.val().profile;
      this.currentUser.id = userSnapshot.key;
      this.recipeProvider.recipeListRef
      .once("value", recipeListSnapshot => {
        this.recipeList = [];
        this.likes_sum = 0;
        recipeListSnapshot.forEach(snap => {
          this.recipeProvider.recipeListRef
          if (snap.val().chef.uid==this.currentUser.id){
            console.log('jackpot!', snap.val().chef.uid);
            this.likes_sum += snap.val().likes_count;
            console.log("total likes", this.likes_sum);
          }
          else {
            console.log("not yours");
          }
        return false;
        });
      });
    });
    this.profileProvider.getMyUserProfile().on("value", userSnapshot => {
      this.currentUserMe = userSnapshot.val();
      this.currentUserMe.id = userSnapshot.key;
    });
    this.recipeProvider.getRecipeList()
    .on("value", recipeListSnapshot => {
      this.recipeList = []; recipeListSnapshot.forEach(snap => {
        if(this.currentUser.id == snap.val().chef.uid){
          this.recipeList.push({
            id: snap.key,
            name: snap.val().name, likes_count: snap.val().likes_count, community: snap.val().community,
            comments_count: snap.val().comments_count, method: snap.val().method, pic: snap.val().pic, likes: snap.val().likes,
            firstName: snap.val().chef.firstName, lastName: snap.val().chef.lastName, ppic: snap.val().chef.pic
          });
        }
        return false;
      });
    });
    this.followed(this.userId);
  }

  followUser(userId: string): void {
    this.profileProvider.updateFollow(this.currentUser.id);
    console.log('followed',this.currentUser.id)
  }

  goToRecipeDetails(recipeId):void{
    this.navCtrl.push(RecipeDetailsPage, {recipeId: recipeId});
  }

  unfollowUser(userId: string): void {
    this.profileProvider.deleteFollow(this.currentUser.id);
    console.log('unfollowed',this.currentUser.id)
  }

  followed(userId: string): void {
    this.profileProvider.userProfileFollowed
    .orderByChild("userId").equalTo(this.currentUser.id).once("value",snapshot => {
    const userData = snapshot.val();
    if (userData){
      this.userData=true;
      console.log("already followed!");
    }
    else if (this.currentUserMe.id == this.currentUser.id){
      this.me=true;
      console.log("cant follow yourself. sorry.");
    }
  });
  }

}
