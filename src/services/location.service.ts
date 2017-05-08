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
  currentPOI: POI;         // 当前定位的POI
  showPOI: POI;           // 最后选定应该显示的POI
  showPOIID: string;      // 最后选定应该显示的POI的ID，若为"current"表示显示定位地址

  constructor(public geolocation: Geolocation,
              public http: Http) {
    this.error = false;

    let temWeather = {
      weather: '',
      temperature: '',
      winddirection: '',
      windpower: '',
      humidity: '',
      reporttime: '暂无',
    };

    this.geolocation.getCurrentPosition().then((resp) => {
      this.currentLatitude = resp.coords.latitude;
      this.currentLongitude = resp.coords.longitude;
      console.log(this.currentLatitude);
      console.log(this.currentLongitude);
      this.userInput = '';
      this.POIList = [];
      this.showPOIID = "current";
      this.showPOI = new POI(this.showPOIID,'北京市','北京市','110101','116.397573,39.908743','天安门广场',temWeather,'010');
      this.getShowPOI().then(poi => {
        this.showPOI = poi;
        this.currentPOI = poi;
      });
    }).catch((error) => {
      console.log('Error getting location', error);
      this.error = true;
      this.currentLongitude = 116.397573;
      this.currentLatitude = 39.908743;
      this.userInput = '';
      this.POIList = [];
      this.showPOIID = "current";
      this.showPOI = new POI(this.showPOIID,'北京市','北京市','110101','116.397573,39.908743','天安门广场',temWeather,'010');
      this.getShowPOI().then(poi => {
        this.showPOI = poi;
        this.currentPOI = poi;
      });
    });
  }

  /**
   * 返回当前位置: [经度,纬度,adcode,省名,城市名称,cityCode]
   *
   */
  getCurrentLocation() {
    if (this.error || this.currentLatitude == undefined || this.currentLongitude == undefined) {
      // 定位失败，返回北京市信息
      return Promise.resolve(['116.397573', '39.908743', '110101', '北京市', '', '010']);
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
              let cityCode = response.json().regeocode.addressComponent.citycode;
              re.push(adcode, province, cityName, cityCode);
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
        let re = new POI(this.showPOIID, loc[3] + " " + loc[4], loc[3] + " " + loc[4], loc[2], loc[0] + ',' + loc[1], '', {}, loc[5]);
        let url = "http://120.25.238.161:8080/pjBack/servlet/Weather?adcode=" + loc[2];
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
      let url = "http://120.25.238.161:8080/pjBack/servlet/Poi?poi=" + this.showPOIID;
      // 请求详细POI
      return this.http.get(url).toPromise().then(
        response => {
          let poi = response.json().pois[0];
          let district = poi.pname + " " + poi.cityname + " " + poi.adname;
          let re = new POI(this.showPOIID, poi.name, district, poi.adcode, poi.location, poi.address, {}, poi.citycode);

          let url = "http://120.25.238.161:8080/pjBack/servlet/Weather?adcode=" + poi.adcode;
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

  // 获得缓存的当前位置
  getShowPOIImmediate() {
    return this.showPOI;
  }

  // 获得输入提示
  getPOIList(input: string) {
    this.userInput = input;
    this.POIList = [];
    let url = 'http://120.25.238.161:8080/pjBack/servlet/InputTips?input=' + this.userInput;

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

  // for searchPage
  setShowPOIID(id) {
    this.showPOIID = id;

    return this.getShowPOI().then(poi => {
      this.showPOI = poi;
      return this.showPOI;
    });
  }

  getHOTList() {
    return ['西湖', '外滩', '故宫博物院', '九寨沟', '八达岭长城', '纳木错', '丽江古城', '张家界', '三亚', '黄山'];
  }

  getPaths(way: string) {
    let origin = this.currentPOI.location.toString();
    let destination = this.showPOI.location.toString();
    console.log(origin);
    console.log(destination);
    let originCityCode = this.currentPOI.cityCode;
    let destinationCityCode = this.showPOI.cityCode;
    let url = "";
    if (way === "car") {
      url = "http://120.25.238.161:8080/pjBack/servlet/DrivingNavigation?coordinate=" + origin + "," + destination;
      console.log(url);
      return this.http.get(url).toPromise().then(
        response => {
          let datas = response.json().route.paths[0];
          console.log(datas);
          return {
            way: way,
            originPOI: this.currentPOI,
            destinationPOI: this.showPOI,
            distance: datas.distance,
            duration: datas.duration,
            tolls: datas.tolls,
            toll_distance: datas.toll_distance,
            traffic_lights: datas.traffic_lights,
            steps: datas.steps
          };
        }
      ).catch(
        error => {
          return error;
        }
      );
    } else if (way === "walk") {
      url = "http://120.25.238.161:8080/pjBack/servlet/WalkingNavigation?coordinate=" + origin + "," + destination;
      console.log(url);
      return this.http.get(url).toPromise().then(
        response => {
          if (response.json().route.paths === undefined) {
            return {
              distance: '-1'
            }
          } else {
            let datas = response.json().route.paths[0];
            console.log(datas);
            return {
              way: way,
              originPOI: this.currentPOI,
              destinationPOI: this.showPOI,
              distance: datas.distance,
              duration: datas.duration,
              steps: datas.steps
            };
          }
        }
      ).catch(
        error => {
          return error;
        }
      );

    } else { //bus
      url = "http://120.25.238.161:8080/pjBack/servlet/BusNavigation?coordinate=" + origin + "," + destination + "," + originCityCode;
      console.log(url);
      return this.http.get(url).toPromise().then(
        response => {
          let datas = response.json().route;
          console.log(datas);
          console.log(datas.transits.length === 0);
          return {
            way: way,
            originPOI: this.currentPOI,
            destinationPOI: this.showPOI,
            distance: datas.distance,
            taxi_cost: datas.taxi_cost,
            transits: datas.transits
          };
        }
      ).catch(
        error => {
          return error;
        }
      );
    }


  }

}
