import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import { Http, URLSearchParams, RequestOptions, Headers } from '@angular/http';

import {TabsPage } from '../tabs/tabs';
import 'rxjs/add/operator/map';

@Component({
  selector: 'page-start',
  templateUrl: 'start.html',
})
export class StartPage {
  addr : string;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,private http: Http) {
    this.addr = "";
  }

  ionViewWillEnter(): void {
    this.addr = window.location.href.split('?')[1];
    if (this.addr == undefined)
      return;
    let url = 'https://api.weibo.com/oauth2/access_token?client_id=3557549856&client_secret=9f402de760b116f6f2eeae00aab96025&grant_type=' +
      'authorization_code&redirect_uri=http://127.0.0.1:8100&code=' + this.addr.split('=')[1];
    let params = new URLSearchParams();
    let headers = new Headers({ 'Access-Control-Allow-Origin': '*' });
    let options = new RequestOptions({ headers: headers });
    console.log(this.addr.split('=')[1]);
    this.http
     .post(url,params, { headers: headers })
     .subscribe(res=>{console.log(res)});
    /*let request = new XMLHttpRequest();
    request.open("POST", url, false);
    request.send();
    request.onload = function (data) {
      alert(data);
    }*/
  }

  weiboLogin() {
    this.navCtrl.push(TabsPage);
  }

  see() {
    this.navCtrl.push(TabsPage);
  }


}
