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
  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController, public authProvider: AuthProvider, public profileProvider: ProfileProvider
  ,  private camera: Camera) {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
    this.storageRef = firebase.storage().ref();
    this.imageRef = this.storageRef.child(`${user.uid}/pROFILEpic.jpg`);
    this.userProfile = firebase.database().ref(`/userProfile/${user.uid}`);
    this.userProfileRef = firebase.database().ref(`/userProfile/${user.uid}`);
  }
});
   }
  ionViewDidLoad() {
    this.profileProvider.getUserProfile().on("value", userProfileSnapshot => {
      this.userProfile = userProfileSnapshot.val(); this.birthDate = userProfileSnapshot.val().birthDate;
      this.status = userProfileSnapshot.val().status;
      this.followed = userProfileSnapshot.val().followed_count;
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
