import { Component, Input} from '@angular/core';
import {
  Alert,
  AlertController,  NavController
} from "ionic-angular";
import { ProfileProvider } from "../../providers/profile/profile";
import { AuthProvider } from "../../providers/auth/auth";
import { LoginPage } from '../login/login';
import { Camera, CameraOptions } from '@ionic-native/camera';
import firebase from 'firebase';
import { Reference} from '@firebase/database-types';
import { RecipeProvider } from "../../providers/recipe/recipe";

@Component({
  selector: 'page-my-profile',
  templateUrl: 'my-profile.html'
})
export class MyProfilePage {
  captureDataUrl: string;
  @Input('useURI') useURI: Boolean = true;
  public storageRef: any;
  public imageRef: any;
  public userProfileRef: Reference;
  public userProfile: any; public birthDate: string;
  public status: string;
  public followed_count: number;
  public currentUserMe: any = {};
  public recipeList: Array<any>;
  public likes_sum: number;
  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController, public authProvider: AuthProvider, public profileProvider: ProfileProvider
  ,  private camera: Camera,public recipeProvider: RecipeProvider) {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
    this.storageRef = firebase.storage().ref();
    this.imageRef = this.storageRef.child(`${user.uid}/pROFILEpic.jpg`);
    this.userProfile = firebase.database().ref(`/userProfile/${user.uid}/profile`);
    this.userProfileRef = firebase.database().ref(`/userProfile/${user.uid}/profile`);
      }
    });
   }
  ionViewDidLoad() {
    this.profileProvider.getUserProfile().on("value", userProfileSnapshot => {
      this.userProfile = userProfileSnapshot.val(); this.birthDate = userProfileSnapshot.val().birthDate;
      this.status = userProfileSnapshot.val().status;
      this.followed_count = userProfileSnapshot.val().followed_count;
    });
    this.profileProvider.getMyUserProfile().on("value", userSnapshot => {
      this.currentUserMe = userSnapshot.val();
      this.currentUserMe.id = userSnapshot.key;
      this.recipeProvider.recipeListRef
      .once("value", recipeListSnapshot => {
        this.recipeList = [];
        this.likes_sum = 0;
        recipeListSnapshot.forEach(snap => {
          this.recipeProvider.recipeListRef
          if (snap.val().chef.uid==this.currentUserMe.id){
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
  }
  logOut(): void {
    this.authProvider.logoutUser().then(() => {
      this.navCtrl.setRoot(LoginPage);
    });
  }
  updateName(): void {
    const alert: Alert = this.alertCtrl.create({
      message: "Your first name & last name",
      inputs: [{
        name: "firstName",
        placeholder: "Your first name", value: this.userProfile.firstName
      }, {
        name: "lastName",
        placeholder: "Your last name",
        value: this.userProfile.lastName
      }
      ], buttons: [
        { text: "Cancel" }, {
          text: "Save", handler: data => {
            this.profileProvider.updateName(data.firstName, data.lastName);
          }
        }]
    });
    alert.present();
  }
  updateStatus(status: string): void {
    this.profileProvider.updateStatus(status);
  }
  updateDOB(birthDate: string): void {
    this.profileProvider.updateDOB(birthDate);
  }

getPicture(sourceType){
        const cameraOptions: CameraOptions = {
          quality: 50,
          destinationType: this.camera.DestinationType.DATA_URL,
          encodingType: this.camera.EncodingType.JPEG,
          mediaType: this.camera.MediaType.PICTURE,
          sourceType: sourceType
        };

        this.camera.getPicture(cameraOptions)
         .then((captureDataUrl) => {
           this.captureDataUrl = 'data:image/jpeg;base64,' + captureDataUrl;
           this.imageRef.putString(this.captureDataUrl, firebase.storage.StringFormat.DATA_URL)
           .then(savedPicture => {
           return this.userProfileRef
           .child(`pic`)
           .set(savedPicture.downloadURL);
           });
        });
      }
}
