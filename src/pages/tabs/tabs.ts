import {Component} from '@angular/core';
import {App, NavController} from "ionic-angular";

import {AboutPage} from '../about/about-tab.component';
import {GaodePage} from '../gaode/gaode-tab.component';
import {WeiboPage} from '../weibo/weibo-tab.component';
import {SearchPage} from '../util/search.component';

import {LocationService} from '../../services/location.service';
import {POI} from "../../entities/POI";

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  currentLocation: POI;

  tab1Root = WeiboPage;
  tab2Root = GaodePage;
  tab3Root = AboutPage;

  //loading: boolean;

  constructor(public navCtrl: NavController,
              public appCtrl: App,
              public locationService: LocationService) {
    /*
     this.loading = true;
     locationService.getShowPOI().then(
     (loc) => {
     console.log("here");
     this.currentLocation = loc;
     this.loading = false;
     });
     */
    this.currentLocation = locationService.getShowPOIImmediate();
  }

  ionViewDidEnter() {
    this.currentLocation = this.locationService.getShowPOIImmediate();
    console.log("tab");
    console.log(this.currentLocation);
  }


  search() {
    this.appCtrl.getRootNav().push(SearchPage);
  }

}
