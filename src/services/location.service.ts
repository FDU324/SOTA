/**
 * Created by kadoufall on 2017/5/6.
 */
import {Injectable} from '@angular/core';
import {Http} from '@angular/http';

import 'rxjs/add/operator/toPromise';
import {Geolocation} from '@ionic-native/geolocation';

import {POI} from '../entities/POI';

@Injectable()
export class LocationService {
  currentLatitude: number;
  currentLongitude: number;
  error: boolean;     // 定位失败

  userInput: string;      // 搜索时的输入
  POIList: POI[];         // 搜索后返回的POI列表
  showPOI: POI;           // 最后选定应该显示的POI
  showPOIID: string;      // 最后选定应该显示的POI的ID，若为"current"表示显示定位地址

  constructor(public geolocation: Geolocation,
              public http: Http) {
    this.error = false;

    this.geolocation.getCurrentPosition().then((resp) => {
      this.currentLatitude = resp.coords.latitude;
      this.currentLongitude = resp.coords.longitude;
      console.log(this.currentLatitude);
      console.log(this.currentLongitude);
      this.userInput = '';
      this.POIList = [];
      this.showPOIID = "current";
      this.getShowPOI().then(poi => {
        this.showPOI = poi;
      });
    }).catch((error) => {
      this.error = true;
      console.log('Error getting location', error);
      this.userInput = '';
      this.POIList = [];
      this.showPOIID = "current";
      this.showPOI = null;
    });
  }

  /**
   * 返回当前位置: [经度,纬度,adcode,省名,城市名称]
   *
   */
  getCurrentLocation() {
    if (this.error || this.currentLatitude == undefined || this.currentLongitude == undefined) {
      // 定位失败，返回北京市信息
      return Promise.resolve(['116.397573', '39.908743', '110101', '北京市', '']);
    } else {
      let url = "http://restapi.amap.com/v3/assistant/coordinate/convert?locations=" + this.currentLongitude + "," + this.currentLatitude + "&coordsys=gps&key=a55c3c970ecab69b1f6e51374a467bba";
      console.log(url);
      return this.http.get(url).toPromise().then(
        response => {
          let datas = response.json().locations;
          console.log(datas);
          let tem = datas.toString().split(";");   // 取第一组
          let re = [];
          let temm = tem[0].split(",");
          re.push(temm[0], temm[1]);
          let url1 = "http://restapi.amap.com/v3/geocode/regeo?location=" + temm[0] + "," + temm[1] + "&key=a55c3c970ecab69b1f6e51374a467bba&extensions=base";

          // 请求逆地理编码
          return this.http.get(url1).toPromise().then(
            response => {
              let adcode = response.json().regeocode.addressComponent.adcode;
              let province = response.json().regeocode.addressComponent.province;
              let cityName = response.json().regeocode.addressComponent.city;
              re.push(adcode, province, cityName);
              console.log(re);
              return re;
            }
          ).catch(
            error => {
              return error;
            }
          );
        }
      ).catch(
        error => {
          console.log("getCurrentLocation \n" + error);
          return error;
        }
      );
    }
  }

  getShowPOI() {
    if (this.showPOIID === "current") {
      //当前定位地址
      return this.getCurrentLocation().then((loc) => {
        let re = new POI(this.showPOIID, loc[3] + " " + loc[4], loc[3] + " " + loc[4], loc[2], loc[0] + loc[1], '', {});
        let url = "http://restapi.amap.com/v3/weather/weatherInfo?key=a55c3c970ecab69b1f6e51374a467bba&city=" + loc[2];
        console.log(url);
        // 请求天气
        return this.http.get(url).toPromise().then(
          response => {
            re.weather = {
              weather: response.json().lives[0].weather,
              temperature: response.json().lives[0].temperature,
              winddirection: response.json().lives[0].winddirection,
              windpower: response.json().lives[0].windpower,
              humidity: response.json().lives[0].humidity,
              reporttime: response.json().lives[0].reporttime,
            };

            console.log(re);
            return re;
          }
        ).catch(
          error => {
            console.log("getShowPOI() current \n" + error);
            return new POI(error, null, null, null, null, null, null);
          }
        );
      });
    }
    else {
      // 搜索的POI
      let url = "http://restapi.amap.com/v3/place/detail?key=a55c3c970ecab69b1f6e51374a467bba&id=" + this.showPOIID;
      // 请求详细POI
      return this.http.get(url).toPromise().then(
        response => {
          let poi = response.json().pois[0];
          let district = poi.pname + " " + poi.cityname + " " + poi.adname;
          let re = new POI(this.showPOIID, poi.name, district, poi.adcode, poi.location, poi.address, {});

          let url = "http://restapi.amap.com/v3/weather/weatherInfo?key=a55c3c970ecab69b1f6e51374a467bba&city=" + poi.adcode;
          // 请求天气
          return this.http.get(url).toPromise().then(
            response => {
              re.weather = {
                weather: response.json().lives[0].weather,
                temperature: response.json().lives[0].temperature,
                winddirection: response.json().lives[0].winddirection,
                windpower: response.json().lives[0].windpower,
                humidity: response.json().lives[0].humidity,
                reporttime: response.json().lives[0].reporttime,
              };

              console.log(re);
              return re;
            }
          ).catch(
            error => {
              console.log("getShowPOI() else weather \n" + error);
              return new POI(error, null, null, null, null, null, null);
            }
          );
        }
      ).catch(
        error => {
          console.log("getShowPOI() else POI \n" + error);
          return new POI(error, null, null, null, null, null, null);
        }
      );
    }

  }

  getShowPOIImmediate() {
    return this.showPOI;
  }


  getPOIList(input: string) {
    this.userInput = input;
    this.POIList = [];
    let url = 'http://restapi.amap.com/v3/assistant/inputtips?&keywords=' + this.userInput + '&key=a55c3c970ecab69b1f6e51374a467bba';

    // 请求输入提示
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
        console.log("getPOIList() \n" + error);
        return error;
      }
    );
  }

  setShowPOIID(id) {
    this.showPOIID = id;

    return this.getShowPOI().then(poi => {
      this.showPOI = poi;
      return this.showPOI;
    });
  }


}
