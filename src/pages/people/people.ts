import { Component, NgZone } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ProfileProvider } from "../../providers/profile/profile";
import firebase from 'firebase';

@Component({
  selector: 'page-people',
  templateUrl: 'people.html'
})
export class PeoplePage {
public userList: Array<any>;
imgsource: any;
public storageRef: any;
public imageRef: any;
  constructor(public navCtrl: NavController, public profileProvider: ProfileProvider, public zone: NgZone) {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.storageRef = firebase.storage().ref();
        this.imageRef = this.storageRef.child(`${user.uid}/pROFILEpic.jpg`);
      }
    });
  }
  ionViewDidLoad() {
    this.displayPic();
    this.profileProvider.getAllUserProfiles().on("value", userProfileSnapshot => {
      this.userList = []; userProfileSnapshot.forEach(snap => {
        this.userList.push({
          id: snap.key,
          firstName: snap.val().firstName
        });
        return false;
      });
    });
  }
  displayPic() {
    this.imageRef.getDownloadURL().then((url) => {
      this.zone.run(() => {
        this.imgsource = url;
       })
    })
  }
}
