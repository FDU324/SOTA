import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';

import {TabsPage } from '../tabs/tabs';

@Component({
  selector: 'page-start',
  templateUrl: 'start.html',
})
export class StartPage {

  constructor(public navCtrl: NavController,
              public navParams: NavParams,) {
  }

  weiboLogin() {
    this.navCtrl.push(TabsPage);
  }

  see() {
    this.navCtrl.push(TabsPage);
  }


}
