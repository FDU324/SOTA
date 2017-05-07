import {NgModule, ErrorHandler, NO_ERRORS_SCHEMA} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {IonicApp, IonicModule, IonicErrorHandler} from 'ionic-angular';
import {HttpModule}    from '@angular/http';

import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {Geolocation } from '@ionic-native/geolocation';

import {MyApp} from './app.component';
import {StartPage} from '../pages/start/start';
import {TabsPage} from '../pages/tabs/tabs';
import {SearchPage} from '../pages/util/search.component';
import {AboutPage} from '../pages/about/about-tab.component';
import {GaodePage} from '../pages/gaode/gaode-tab.component';
import {WeiboPage} from '../pages/weibo/weibo-tab.component';


import {GaodeService} from '../services/gaode.service';
import {LocationService} from '../services/location.service';

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    WeiboPage,
    GaodePage,
    TabsPage,
    StartPage,
    SearchPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    WeiboPage,
    GaodePage,
    TabsPage,
    SearchPage,
    StartPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    GaodeService,
    LocationService
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class AppModule {
}
