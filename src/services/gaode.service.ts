/**
 * Created by kadoufall on 2017/5/6.
 */
import {Injectable} from '@angular/core';
import {Http} from '@angular/http';

import 'rxjs/add/operator/toPromise';

import {POI} from '../entities/POI';

@Injectable()
export class GaodeService {
  userInput: string;
  POIList: POI[];
  showPOI: POI;
  currentLoc: string;

  constructor(public http: Http) {
    this.userInput = '';
    this.POIList = [];
    this.showPOI = null;
    this.currentLoc = '';   // 定位
  }

  getPOIList(input: string) {
    this.userInput = input;
    this.POIList = [];
    let url = 'http://restapi.amap.com/v3/assistant/inputtips?&keywords=' + this.userInput + '&key=a55c3c970ecab69b1f6e51374a467bba';

    return this.http.get(url).toPromise().then(
      response => {
        // console.log(response.json().tips);
        let datas = response.json().tips;
        datas.forEach(data => {
          let temPOI = new POI(data.id, data.name, data.district, data.adcode, data.location, data.address);
          this.POIList.push(temPOI);
        });

        return this.POIList;
      }
    ).catch(
      error => {
        return error;
      }
    );
  }

  /*
  getPOIInfo(POIID) {
    let temWeather = {
      "weather": "多云",
      "temperature": "18",
      "winddirection": "南",
      "windpower": "6",
      "humidity": "42",
      "reporttime": "2017-05-06 14:00:00"
    };
    let re = new POI('B0345001JL', '九寨沟', '四川省阿坝藏族羌族自治州九寨沟县', '513225', '103.912874,33.142376', '漳扎镇', temWeather);
    this.showPOI = re;
    return Promise.resolve(re);
  }
  */

  /*
  getShowPOI() {
    let temWeather = {
      "weather": "多云",
      "temperature": "18",
      "winddirection": "南",
      "windpower": "6",
      "humidity": "42",
      "reporttime": "2017-05-06 14:00:00"
    };
    let re = new POI('B0345001JL', '九寨沟', '四川省阿坝藏族羌族自治州九寨沟县', '513225', '103.912874,33.142376', '漳扎镇', temWeather);
    return this.showPOI === null ? re : this.showPOI;
  }
  */

  getPaths(way: string) {
    let origin = "116.481028,39.989643";
    let destination = "116.465302,40.004717";
    let city = "010";
    let url = "";
    if (way === "car") {
      url = "http://restapi.amap.com/v3/direction/driving?origin=" + origin + "&destination=" + destination + "&extensions=all&key=a55c3c970ecab69b1f6e51374a467bba";
    } else if (way === "walk") {
      url = "http://restapi.amap.com/v3/direction/walking?origin=" + origin + "&destination=" + destination + "&key=a55c3c970ecab69b1f6e51374a467bba";
    } else if (way === "bus") {
      url = "http://restapi.amap.com/v3/direction/transit/integrated?origin=" + origin + "&destination=" + destination + "&city=" + city + "&key=a55c3c970ecab69b1f6e51374a467bba";
    }

    console.log(url);

    return this.http.get(url).toPromise().then(
      response => {
        console.log(response.json().route);
        let datas = response.json().route;


        return datas;
      }
    ).catch(
      error => {
        return error;
      }
    );

  }


}
