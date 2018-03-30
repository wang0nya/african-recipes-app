import { Component, Input  } from '@angular/core';
import { NavController } from 'ionic-angular';
import { RecipeProvider } from "../../providers/recipe/recipe";
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import firebase from 'firebase';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Reference} from '@firebase/database-types';
import { ProfileProvider } from "../../providers/profile/profile";

@Component({
  selector: 'page-add-recipe',
  templateUrl: 'add-recipe.html'
})
export class AddRecipePage {
captureDataUrl: string;
@Input('useURI') useURI: Boolean = true;
public recipeListRef: Reference;
public currentUserMe: any = {};
// https://ionicacademy.com/http-calls-ionic/
communities: Observable<any>;
  constructor(public navCtrl: NavController, public httpClient: HttpClient,
  public recipeProvider: RecipeProvider, private camera: Camera, public profileProvider: ProfileProvider) {
    this.communities = this.httpClient.get('http://siridesigns.co.ke/communities.json');
    this.communities
    .subscribe(data => {
      console.log('my data: ', data);
    })
  }
createRecipe(recipeName: string, recipeIngredients: string, recipeCommunity: string,
  recipeServings: number, recipeMethod: string, currentUserMe): void {
    this.recipeProvider
      .createRecipe(recipeName, recipeIngredients, recipeCommunity, recipeServings, recipeMethod, this.currentUserMe).then(newRecipe => {
        firebase
        .storage()
        .ref(`${newRecipe.key}/pic.jpg`)
        .putString(this.captureDataUrl, firebase.storage.StringFormat.DATA_URL)
        .then(savedPicture => {
        return this.recipeProvider.recipeListRef
        .child(`${newRecipe.key}/pic`)
        .set(savedPicture.downloadURL);
        });
        this.navCtrl.pop();
      });
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
        }, (err) => {
            console.log(err);
        });
      }
      ionViewDidLoad() {
        this.profileProvider.getUserProfile().on("value", userSnapshot => {
          this.currentUserMe = userSnapshot.val();
          console.log('ok, its me', userSnapshot.val())
        });
      }
}
