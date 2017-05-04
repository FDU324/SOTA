import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  location: string;
  submitted: boolean;

  constructor(public navCtrl: NavController) {
    this.location = '';
    this.submitted = false;

  }

  searchLoc() {
    this.submitted = true;
    this.location = '';
  }

  sendWeibo() {
    
  }

  clear() {
    this.submitted = false;
  }

}
