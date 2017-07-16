import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

import { AddShoppingPage } from '../add-shopping/add-shopping';
import { ShoppingItem } from '../../models/shopping-item/shopping-item.interface';
import { EditShoppingItemPage } from '../edit-shopping-item/edit-shopping-item';

@Component({
  selector: 'page-shopping-list',
  templateUrl: 'shopping-list.html',
})
export class ShoppingListPage {

  shoppingListRef$: FirebaseListObservable<ShoppingItem[]>

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private database: AngularFireDatabase,
    private actionSheetCtrl: ActionSheetController) {
    /*
      Pointing shoppingListRef$ at Firebase -> 'shopping-list' node.
      That means not only can we push things from this reference to the database, but ALSO we have access to everything inside of that node. 
    */
    this.shoppingListRef$ = this.database.list('shopping-list');
  }

  /*
    Display an ActionSheet that gives the user the following options:

    1. Edit the ShoppingItem
    2. Delete the ShoppingItem
    3. Cancel the selection
  */
  selectShoppingItem(shoppingItem: ShoppingItem) {
    this.actionSheetCtrl.create({
      title: `${shoppingItem.itemName}`,
      buttons: [
        {
          text: 'Edit',
          handler: () => {
            // Send the user to the EditShoppingItemPage and pass the key as a parameter
            this.navCtrl.push(EditShoppingItemPage,
              { shoppingItemId: shoppingItem.$key });
            
            /*
             Navigation stack:
             
              ['ShoppingListPage',
               'EditShoppingItemPage',
               { shoppingItemId: '-KowULdyLOK4ruWoKhws'}]
            
            */
          }
        },
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => {
            // Delete the current ShoppingItem, passed in via the parameter
            this.shoppingListRef$.remove(shoppingItem.$key);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log("The user has selected the cancel button");
          }
        }
      ]
    }).present();
  }


  navigateToAddShoppingPage() {
    // Navigate the user to the AddShoppingPage
    this.navCtrl.push(AddShoppingPage);
  }

}
