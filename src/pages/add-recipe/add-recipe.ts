import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { RecipeProvider } from "../../providers/recipe/recipe";
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'page-add-recipe',
  templateUrl: 'add-recipe.html'
})
export class AddRecipePage {
// https://ionicacademy.com/http-calls-ionic/
communities: Observable<any>;
  constructor(public navCtrl: NavController, public httpClient: HttpClient,
  public recipeProvider: RecipeProvider) {
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
        this.navCtrl.pop();
      });
  }
}
