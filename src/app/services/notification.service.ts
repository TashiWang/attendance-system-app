import { Injectable } from '@angular/core';
import { LocalNotifications } from '@awesome-cordova-plugins/local-notifications/ngx';
import { CookieService } from 'ngx-cookie-service';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(
    private localNotifications: LocalNotifications,
    private cookieService: CookieService,
    private datePipe: DatePipe
  ) {}

  notifyOnArrival() {
    navigator.geolocation.getCurrentPosition((position) => {
      let d_lat: any = position.coords.latitude,
        d_lon: any = position.coords.longitude,
        o_lat: any = 27.468531209527367,
        o_lon: any = 89.6407073377182;

      let p = 0.017453292519943295; // Math.PI / 180
      let c = Math.cos;
      let a =
        0.5 -
        c((o_lat - d_lat) * p) / 2 +
        (c(d_lat * p) * c(o_lat * p) * (1 - c((o_lon - d_lon) * p))) / 2;

      let distance = 12742 * Math.asin(Math.sqrt(a)) * 1000;

      if (
        distance <= 200 &&
        this.datePipe.transform(new Date(), 'EEEE') != 'Sunday'
      ) {
        this.localNotifications.schedule([
          {
            id: 1,
            title: 'Welcome ' + this.cookieService.get('name'),
            text: 'Please tap to scan the QR Code',
            trigger: {
              every: { hour: 9, minute: 0 },
              count: 1,
            },
          },
        ]);
      }
    });
  }

  async remindOnLate() {
    this.localNotifications.schedule({
      id: 2,
      title: 'Forgot to scan QR code?',
      text: 'Please tap to scan. Ignore if you have already scanned',
      foreground: true,
      trigger: {
        every: { hour: 9, minute: 20 },
        count: 1,
      },
    });
  }
  async greetMorning() {
    this.localNotifications.schedule({
      id: 3,
      title: 'Good Morning ' + this.cookieService.get('name'),
      text: 'Please remember to scan the QR Code',
      foreground: true,
      trigger: {
        every: { hour: 8, minute: 50 },
        count: 1,
      },
    });
  }
}
