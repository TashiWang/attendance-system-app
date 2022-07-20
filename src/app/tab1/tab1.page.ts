import { Component } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Platform } from '@ionic/angular';

const avatarColors = ["#FFB6C1", "#2c3e50", "#95a5a6", "#f39c12", "#1abc9c"];


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page {
  email: any;
  name: any;
  employee_id: any;
  profile_photo_url: any;
  created_at: any;
  paddingInline: boolean = false;

  constructor(
    private cookieService: CookieService,
    private platform: Platform,
  ) {
    this.platform.ready().then(() => {
      if (this.platform.is('android')) {
        this.paddingInline = true;
      }
    });
    this.get();
  }

  get() {
    this.email = this.cookieService.get('email');
    this.name = this.cookieService.get('name');
    this.employee_id = this.cookieService.get('employee_id');
    this.profile_photo_url = this.cookieService.get('profile_photo_url');
    this.created_at = this.cookieService.get('created_at');
  }
}
