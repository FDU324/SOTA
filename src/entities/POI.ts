/**
 * Created by kadoufall on 2017/5/6.
 */
export class POI{
  constructor(public id: string,
              public name: string,
              public district: string,    // 省市区
              public adcode: string,
              public location: string,    // 经纬度
              public address: string,     // 详细地址
              public weather?: object,
              public nav?: string[]

  ) {
  }
}
