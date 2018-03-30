import { Component} from '@angular/core';
import { NavController } from 'ionic-angular';
import { ProfileProvider } from "../../providers/profile/profile";
import firebase from 'firebase';
import { ProfileViewPage } from '../profile-view/profile-view';

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
      this.userList = [];
      userProfileSnapshot.forEach(snap => {
        console.log(snap.val())
        this.userList.push({
          id: snap.key,
          firstName: snap.val().profile.firstName, lastName: snap.val().profile.lastName, pic: snap.val().profile.pic,
          status: snap.val().profile.status
        });
        return false;
      });
    });
  }
  goToUserDetails(userId):void{
    this.navCtrl.push(ProfileViewPage, {userId: userId});
    console.log('you just pushed',userId)
  }
}
