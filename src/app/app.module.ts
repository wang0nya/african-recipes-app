import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { MyProfilePage } from '../pages/my-profile/my-profile';
import { SearchPage } from '../pages/search/search';
import { LoginPage } from '../pages/login/login';
import { SignupPage } from '../pages/signup/signup';
import { ResetPasswordPage } from '../pages/reset-password/reset-password';
import { AddRecipePage } from '../pages/add-recipe/add-recipe';
import { PeoplePage } from '../pages/people/people';
import { FollowersPage } from '../pages/followers/followers';
import { FollowingPage } from '../pages/following/following';
import { AboutPage } from '../pages/about/about';
import { HttpClientModule } from '@angular/common/http';
import { RecipeDetailsPage } from '../pages/recipe-details/recipe-details';
import { ProfileViewPage } from '../pages/profile-view/profile-view';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AuthProvider } from '../providers/auth/auth';
import { ProfileProvider } from '../providers/profile/profile';
import { RecipeProvider } from '../providers/recipe/recipe';

import { Camera } from '@ionic-native/camera';
@NgModule({
  declarations: [
    MyApp,
    HomePage,
    MyProfilePage,
    SearchPage,
    LoginPage,
    SignupPage,
    ResetPasswordPage,
    AddRecipePage,
    PeoplePage,
    FollowersPage,
    FollowingPage,
    AboutPage,
    RecipeDetailsPage,
    ProfileViewPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    MyProfilePage,
    SearchPage,
    LoginPage,
    SignupPage,
    ResetPasswordPage,
    AddRecipePage,
    PeoplePage,
    FollowersPage,
    FollowingPage,
    AboutPage,
    RecipeDetailsPage,
    ProfileViewPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthProvider,
    ProfileProvider,
    RecipeProvider,
    Camera
  ]
})
export class AppModule {}
