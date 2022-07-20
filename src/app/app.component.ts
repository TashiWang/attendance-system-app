import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { BackgroundMode } from '@awesome-cordova-plugins/background-mode/ngx';
import { NotificationService } from './services/notification.service';
import { ForegroundService } from '@awesome-cordova-plugins/foreground-service/ngx';
import { LocalNotifications } from '@awesome-cordova-plugins/local-notifications/ngx';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    // private platform: Platform,
    private backgroundMode: BackgroundMode,
    private notificationService: NotificationService,
    private foregroundService: ForegroundService,
    // private localNotifications: LocalNotifications,
    private datePipe: DatePipe
  ) {
    if (this.datePipe.transform(new Date(), 'EEEE') != 'Sunday') {
      notificationService.remindOnLate();
      notificationService.greetMorning();
      notificationService.notifyOnArrival();
    }
    foregroundService.start(
      'GPS Running',
      'Background Service',
      'drawable/fsicon'
    );
    backgroundMode.enable();
    backgroundMode.setDefaults({ silent: true });
  }
}
