/**
 * Created by kadoufall on 2017/5/6.
 */
import {Component} from '@angular/core';
import {NavController, ViewController} from 'ionic-angular';

import {POI} from '../../entities/POI';
import {GaodeService} from "../../services/gaode.service";
import {LocationService} from "../../services/location.service";

@Component({
  selector: 'page-search',
  templateUrl: 'search.component.html'
})
export class SearchPage {
  HOTList: string[];
  inputContent: string;
  POIList: POI[];
  choosePOI: POI;

  constructor(public navCtrl: NavController,
              public viewCtrl: ViewController,
              public gaodeService: GaodeService,
              public locationService: LocationService) {
    this.HOTList = ['九寨沟', '故宫', '纳木错', '西湖', '外滩'];
    this.inputContent = '';
    this.POIList = [];
    this.choosePOI = null;
  }

  searchPOI(ev) {
    this.inputContent = ev.target.value;

    if (this.inputContent && this.inputContent.trim() != '') {
      this.locationService.getPOIList(this.inputContent).then(POIList => {
        this.POIList = POIList;
      });
    } else {
      this.POIList = [];
      ev.target.value = ev.target.value.trim();
    }
  }


  showDetail(POI) {
    this.locationService.setShowPOIID(POI.id).then(
      () => {
        this.viewCtrl.dismiss();
      }
    ).catch(
      error => {
        console.log(error);
      }
    );
  }


}
