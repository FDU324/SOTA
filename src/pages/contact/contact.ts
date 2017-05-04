import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {
  location: string;

  constructor(public navCtrl: NavController) {
    this.location = '';

  }

  searchLoc() {
    
  }

}
