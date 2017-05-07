import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';

@Component({
  selector: 'page-weibo',
  templateUrl: 'weibo-tab.component.html'
})
export class WeiboPage {
  location: string;
  weibo: string;
  submitted: boolean;

  constructor(public navCtrl: NavController) {
    this.location = '';
    this.submitted = false;
    this.weibo = '';
  }

  searchLoc() {
    /*var request = new XMLHttpRequest();
     request.open("GET","http://120.25.238.161:8080/servlet/Weather?city="+this.location,false);
     request.send();
     this.weibo = request.responseText;*/
    this.submitted = true;
    this.location = '';
  }

  sendWeibo() {

  }

  clear() {
    this.submitted = false;
  }

}
