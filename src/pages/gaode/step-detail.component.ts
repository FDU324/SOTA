/**
 * Created by kadoufall on 2017/5/8.
 */

import {Component} from '@angular/core';
import {NavController,NavParams} from 'ionic-angular';


@Component({
  selector: 'page-step-detail',
  templateUrl: 'step-detail.component.html'
})
export class StepDetailPage {
  step: object;
  type: string;

  constructor(public navParms:NavParams){
    this.step = navParms.get('step');
    this.type = navParms.get('type');
  }


}
