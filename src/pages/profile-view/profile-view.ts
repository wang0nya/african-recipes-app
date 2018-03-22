import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import firebase from 'firebase';
import { ProfileProvider } from "../../providers/profile/profile";
import { RecipeProvider } from "../../providers/recipe/recipe";

/**
 * Generated class for the ProfileViewPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

 @IonicPage({
   segment: 'rprofile-view/:userId'
 })
 @Component({
  selector: 'page-profile-view',
  templateUrl: 'profile-view.html',
})
export class ProfileViewPage {
  public currentUser: any = {};
  constructor(public navCtrl: NavController, public navParams: NavParams, public profileProvider: ProfileProvider
  ,public recipeProvider: RecipeProvider) {

  }

  ionViewDidLoad() {
    this.profileProvider.getUserDetail(this.navParams.get("userId")).on("value", userSnapshot => {
      this.currentUser = userSnapshot.val();
      this.currentUser.id = userSnapshot.key;
    });
    console.log('ionViewDidLoad ProfileViewPage');
  }

}
