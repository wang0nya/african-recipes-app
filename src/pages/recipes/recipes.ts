import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { Recipe } from '../../models/recipe';
import { RecipesService } from '../../providers/recipes.service';
import { RecipeDetailPage } from '../recipe-detail/recipe-detail';

@Component({
  selector: 'page-recipes',
  templateUrl: 'recipes.html'
})
export class RecipesPage {
  recipes: Recipe[];
  searchTerm: string = '';

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private recipesService: RecipesService) {
       
    } 

  initializeRecipes(): void {
    this.recipes = this.recipesService.getRecipes();
  }
   
  ionViewDidLoad() {
    this.initializeRecipes();
  }

  onSelect(recipe: Recipe): void {
    this.navCtrl.push(RecipeDetailPage, {recipe: recipe});
  }

  searchRecipes(){

      // Reset recipes array back to all of the items
      this.initializeRecipes();

      // if the search term is an empty string return all items
      if (!this.searchTerm) {
        return this.recipes;
      }
      
      // Filter recipes
      this.recipes = this.recipes.filter((item) => {
          return item.recipeName.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1;
      }); 
    }
}
