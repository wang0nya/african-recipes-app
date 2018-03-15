import { Component, Input  } from '@angular/core';
import { NavController } from 'ionic-angular';
import { RecipeProvider } from "../../providers/recipe/recipe";
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import firebase from 'firebase';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Reference} from '@firebase/database-types';

@Component({
  selector: 'page-add-recipe',
  templateUrl: 'add-recipe.html'
})
export class AddRecipePage {
captureDataUrl: string;
@Input('useURI') useURI: Boolean = true;
storageRef: any;
imageRef: any;
public recipeListRef: Reference;
// https://ionicacademy.com/http-calls-ionic/
communities: Observable<any>;
  constructor(public navCtrl: NavController, public httpClient: HttpClient,
  public recipeProvider: RecipeProvider, private camera: Camera) {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.recipeListRef = firebase
          .database().ref(`/userProfile/${user.uid}/recipeList`);
      }
    });
    this.communities = this.httpClient.get('http://siridesigns.co.ke/communities.json');
    this.communities
    .subscribe(data => {
      console.log('my data: ', data);
    })
  }
createRecipe(recipeName: string, recipeIngredients: string, recipeCommunity: string,
  recipeServings: number, recipeMethod: string): void {
    this.recipeProvider
      .createRecipe(recipeName, recipeIngredients, recipeCommunity, recipeServings, recipeMethod).then(newRecipe => {
        firebase
        .storage()
        .ref(`${newRecipe.key}/pic.jpg`)
        .putString(this.captureDataUrl, firebase.storage.StringFormat.DATA_URL)
        .then(savedPicture => {
        return this.recipeListRef
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
// ionViewWillLeave() {
//       this.uploadPic();
//     console.log("Looks like I'm about to leave :(");
//   }
// uploadPic(recipeId: string) : PromiseLike<any> {
//   this.imageRef.putString(this.captureDataUrl, firebase.storage.StringFormat.DATA_URL)
//   .then(savedPicture => {
//   return this.recipeListRef
//   .child(`${recipeId}/pic`)
//   .push(savedPicture.downloadURL);
//   });
//   }
}
