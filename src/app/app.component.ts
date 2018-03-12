import { Component, ViewChild } from '@angular/core';
import { Platform, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { AddRecipePage } from '../pages/add-recipe/add-recipe';
import { MyProfilePage } from '../pages/my-profile/my-profile';
import { PeoplePage } from '../pages/people/people';
import { AboutPage } from '../pages/about/about';


import { LoginPage } from '../pages/login/login';



@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) navCtrl: Nav;
    rootPage:any = LoginPage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
  goToHome(params){
    if (!params) params = {};
    this.navCtrl.setRoot(HomePage);
  }goToAddRecipe(params){
    if (!params) params = {};
    this.navCtrl.setRoot(AddRecipePage);
  }goToMyProfile(params){
    if (!params) params = {};
    this.navCtrl.setRoot(MyProfilePage);
  }goToPeople(params){
    if (!params) params = {};
    this.navCtrl.setRoot(PeoplePage);
  }goToAbout(params){
    if (!params) params = {};
    this.navCtrl.setRoot(AboutPage);
  }
}
