import { AuthService } from './../services/auth.service';
import { Platform } from '@ionic/angular';
import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
})
export class Tab3Page {
  paddingInline: boolean = false;

  constructor(
    private platform: Platform,
    private authService: AuthService,
    private alertCtrl: AlertController
  ) {
    this.platform.ready().then(() => {
      if (this.platform.is('android')) {
        this.paddingInline = true;
      }
    });
  }

  openCameraSettings() {}

  async confirmLogout() {
    const alert = await this.alertCtrl.create({
      cssClass: 'alert-style',
      header: 'Confirmation',
      message: 'Are you sure you want to log out?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {},
        },
        {
          text: 'Yes',
          id: 'confirm-button',
          cssClass: 'confirm-button',
          handler: () => {
            this.authService.logout();
          },
        },
      ],
    });
    await alert.present();
  }
}
