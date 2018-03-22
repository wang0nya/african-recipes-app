import { Injectable } from '@angular/core';
import firebase from 'firebase';
import { User } from '@firebase/auth-types';
import { Reference } from '@firebase/database-types';

/*
  Generated class for the ProfileProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ProfileProvider {
  public userProfile: Reference;
  public allUserProfiles: Reference;
  public currentUser: User;
  constructor() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.currentUser = user;
        this.userProfile = firebase.database().ref(`/userProfile/${user.uid}`);
        this.allUserProfiles = firebase.database().ref(`/userProfile/`);
      }
    });
  }

  getUserProfile(): Reference {
    return this.userProfile;
  }

  getAllUserProfiles(): Reference {
    return this.allUserProfiles;
  }

  updateName(firstName: string, lastName: string): Promise<any> {
    return this.userProfile.update({ firstName, lastName });
  }

  updateStatus(status: string): Promise<any> {
    return this.userProfile.update({ status });
  }

  updateDOB(birthDate: string): Promise<any> {
    return this.userProfile.update({ birthDate });
  }

}
