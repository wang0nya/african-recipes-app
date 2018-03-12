import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { Recipe } from '../../models/recipe';

@Component({
  selector: 'page-recipe-detail',
  templateUrl: 'recipe-detail.html'
})
export class RecipeDetailPage {

  recipe: Recipe;

  constructor(public navCtrl: NavController, public navParams: NavParams) 
  {
      this.recipe = this.navParams.get("recipe");
  }
}