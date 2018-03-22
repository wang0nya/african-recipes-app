import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProfileViewPage } from './profile-view';

@NgModule({
  declarations: [
    ProfileViewPage,
  ],
  imports: [
    IonicPageModule.forChild(ProfileViewPage),
  ],
})
export class ProfileViewPageModule {}
