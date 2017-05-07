import {Component} from '@angular/core';
import {App, NavController, NavParams} from 'ionic-angular';

import {TabsPage} from '../tabs/tabs';

import {LocationService} from '../../services/location.service';

@Component({
  selector: 'page-start',
  templateUrl: 'start.html',
})
export class StartPage {

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public appCtrl: App,
              public locationService: LocationService) {
  }

  weiboLogin() {
    this.appCtrl.getRootNav().push(TabsPage);
  }

  see() {
    this.appCtrl.getRootNav().push(TabsPage);
  }


}
