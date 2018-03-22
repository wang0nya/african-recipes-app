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
  updateDOB(birthDate: string): void {
    this.profileProvider.updateDOB(birthDate);
  }
//   updateEmail(): void {
//     let alert: Alert = this.alertCtrl.create({
//       inputs: [{ name: 'newEmail', placeholder: 'Your new email' },
//       { name: 'password', placeholder: 'Your password', type: 'password' }], buttons: [
//         { text: 'Cancel' }, {
//           text: 'Save',
//           handler: data => {
//             this.profileProvider
//             .updateEmail(data.newEmail, data.password)
//             .then(() => { console.log('Email Changed Successfully'); })
//             .catch (error => { console.log('ERROR: ' + error.message); });
//           }
//         }]
//     });
//     alert.present();
//   }
//
// updatePassword(): void {
//   let alert: Alert = this.alertCtrl.create({
//     inputs: [
//       { name: 'newPassword', placeholder: 'New password', type: 'password' }, { name: 'oldPassword', placeholder: 'Old password', type: 'password' }],
//     buttons: [
//       { text: 'Cancel' }, {
//         text: 'Save',
//         handler: data => {
//           this.profileProvider.updatePassword(data.newPassword, data.oldPassword);
//         }
//       }]
//   }); alert.present();
// }
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
