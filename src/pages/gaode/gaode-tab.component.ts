import {Component} from '@angular/core';
import {NavController, ActionSheetController} from 'ionic-angular';

import {POI} from "../../entities/POI";
import {LocationService} from "../../services/location.service";
import {SearchPage} from "../util/search.component";

@Component({
  selector: 'page-gaode',
  templateUrl: 'gaode-tab.component.html'
})
export class GaodePage {
  showPOI: POI;
  navs: object[];
  chooseNav: string;

  //loading: boolean;

  constructor(public navCtrl: NavController,
              public actionSheetCtrl: ActionSheetController,
              public locationService: LocationService) {
    /*
     this.loading = true;
     locationService.getShowPOI().then(
     poi => {
     this.showPOI = poi;
     this.loading = false;
     }
     );
     */
    this.showPOI = locationService.getShowPOIImmediate();
    this.navs = [
      {
        text: '驾车',
        value: 'car',
      },
      {
        text: '步行',
        value: 'walk',
      },
      {
        text: '公交',
        value: 'bus',
      },
    ];
    this.chooseNav = 'car';
  }

  ionViewDidEnter() {
    this.showPOI = this.locationService.getShowPOIImmediate();
  }

  showNav() {
    this.locationService.getPaths(this.chooseNav).then((data) => {
      console.log(data);
    });
  }

  search() {
    this.navCtrl.push(SearchPage);
  }


}
