import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthService } from './services/auth.service';
import { HttpClientModule } from '@angular/common/http';
import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner/ngx';
import { HTTP } from '@awesome-cordova-plugins/http/ngx';
import { DatePipe } from '@angular/common';
import { LocalNotifications } from '@awesome-cordova-plugins/local-notifications/ngx';
import { NotificationService } from './services/notification.service';
import { BackgroundMode } from '@awesome-cordova-plugins/background-mode/ngx';
import { ForegroundService } from '@awesome-cordova-plugins/foreground-service/ngx';
import { Vibration } from '@awesome-cordova-plugins/vibration/ngx';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    AuthService,
    BarcodeScanner,
    HTTP,
    DatePipe,
    LocalNotifications,
    NotificationService,
    BackgroundMode,
    ForegroundService,
    Vibration,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
