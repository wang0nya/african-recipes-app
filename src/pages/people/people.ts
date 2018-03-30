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
public loadedUserList:Array<any>;
public userRef:firebase.database.Reference;
  constructor(public navCtrl: NavController, public profileProvider: ProfileProvider) {
    // searchbar
    this.userRef = this.profileProvider.allUserProfiles;
    this.userRef.on('value', userList => {
      let users = [];
      userList.forEach( snap => {
        users.push({
          id: snap.key,
          firstName: snap.val().profile.firstName, lastName: snap.val().profile.lastName, pic: snap.val().profile.pic,
          status: snap.val().profile.status
        });
        return false;
      });

      this.userList = users;
      this.loadedUserList = users;
    });
  }
  initializeItems(): void {
  this.userList = this.loadedUserList;
}
getItems(searchbar) {
  // Reset items back to all of the items
  this.initializeItems();

  // set q to the value of the searchbar
  var q = searchbar.srcElement.value;


  // if the value is an empty string don't filter the items
  if (!q) {
    return;
  }

  this.userList = this.userList.filter((v) => {
    if(v.firstName && q || v.lastName && q) {
      if ((v.firstName.toLowerCase().indexOf(q.toLowerCase()) > -1) || (v.lastName.toLowerCase().indexOf(q.toLowerCase()) > -1)) {
        return true;
      }
      return false;
    }
  });

  console.log(q, this.userList.length);

}
  ionViewDidLoad() {

  }
  goToUserDetails(userId):void{
    this.navCtrl.push(ProfileViewPage, {userId: userId});
    console.log('you just pushed',userId)
  }
}
