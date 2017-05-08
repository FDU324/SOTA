import {Component} from '@angular/core';
import {NavController, ActionSheetController, App} from 'ionic-angular';

import {POI} from "../../entities/POI";
import {LocationService} from "../../services/location.service";
import {SearchPage} from "../util/search.component";
import {StepDetailPage} from './step-detail.component';

@Component({
  selector: 'page-gaode',
  templateUrl: 'gaode-tab.component.html'
})
export class GaodePage {
  showPOI: POI;
  navs: object[];
  chooseNav: string;

  navContent: object;


  //loading: boolean;

  constructor(public navCtrl: NavController,
              public actionSheetCtrl: ActionSheetController,
              public appCtrl: App,
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
    this.navContent = null;
  }

  ionViewDidEnter() {
    this.showPOI = this.locationService.getShowPOIImmediate();
  }

  showNav() {
    console.log(this.chooseNav);
    this.locationService.getPaths(this.chooseNav).then((data) => {
      console.log(data);
      this.navContent = data;
    });
  }

  search() {
    this.navCtrl.push(SearchPage);
  }

  seeStep(step, type) {
    this.appCtrl.getRootNav().push(StepDetailPage, {
      type: type,
      step: step,
    });
  }


}
