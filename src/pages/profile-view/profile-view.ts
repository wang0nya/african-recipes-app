import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ProfileProvider } from "../../providers/profile/profile";
import { RecipeProvider } from "../../providers/recipe/recipe";

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
  public userId: string;
  public currentUser: any = {};
  constructor(public navCtrl: NavController, public navParams: NavParams, public profileProvider: ProfileProvider
  ,public recipeProvider: RecipeProvider) {

  }

  ionViewDidLoad() {
    this.profileProvider.getUserDetail(this.navParams.get("userId")).on("value", userSnapshot => {
      this.currentUser = userSnapshot.val();
      this.currentUser.id = userSnapshot.key;
    });
    this.followed(this.userId);
  }

  followUser(userId: string): void {
    this.profileProvider.updateFollow(this.currentUser.id);
    console.log('followed',this.currentUser.id)
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
      console.log("you already followed the guy man!");
    }
    else {
      console.log("worth following? go ahead!");
    }
  });
  }

}
