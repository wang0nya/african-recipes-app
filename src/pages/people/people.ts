import { Component} from '@angular/core';
import { NavController } from 'ionic-angular';
import { ProfileProvider } from "../../providers/profile/profile";
import firebase from 'firebase';

@Component({
  selector: 'page-people',
  templateUrl: 'people.html'
})
export class PeoplePage {
public userList: Array<any>;
public storageRef: any;
public imageRef: any;
  constructor(public navCtrl: NavController, public profileProvider: ProfileProvider) {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.storageRef = firebase.storage().ref();
        this.imageRef = this.storageRef.child(`${user.uid}/pROFILEpic.jpg`);
      }
    });
  }
  ionViewDidLoad() {
    this.profileProvider.getAllUserProfiles().on("value", userProfileSnapshot => {
      this.userList = []; userProfileSnapshot.forEach(snap => {
        this.userList.push({
          id: snap.key,
          firstName: snap.val().firstName, lastName: snap.val().lastName, pic: snap.val().pic,
          status: snap.val().status
        });
        return false;
      });
    });
  }
}
