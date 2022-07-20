import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { NavController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private httpClient: HttpClient,
    private cookieService: CookieService,
    private navCtrl: NavController
  ) {}

  baseUrl = 'https://attendance.tashicell.com/api';

  data: any;

  login(email: any, password: any) {
    let header: Headers = new Headers();

    header.set('Accept', 'text/html; charset-utf-8');
    header.append('Content-Type', 'application/json; charset-utf-8');

    let userData = {
      email: email,
      password: password,
    };

    return new Promise((resolve) => {
      this.httpClient
        .post(this.baseUrl + '/login', userData)
        .pipe()
        .subscribe(
          (data) => {
            this.data = data;
            resolve(this.data);
            this.cookieService.delete('id', '/members');
            this.cookieService.delete('email', '/members');
            this.cookieService.delete('name', '/members');
            this.cookieService.delete('employee_id', '/members');
            this.cookieService.delete('created_at', '/members');
            this.cookieService.delete('profile_photo_url', '/members');

            this.cookieService.set('id', this.data.id);
            this.cookieService.set('email', this.data.email);
            this.cookieService.set('name', this.data.name);
            this.cookieService.set('employee_id', this.data.employee_id);
            this.cookieService.set(
              'profile_photo_url',
              this.data.profile_photo_url
            );
            this.cookieService.set('created_at', this.data.created_at);
          },
          (error) => {
            let status = 'error';
            resolve(status);
          }
        );
    });
  }

  logout() {
    this.cookieService.delete('id', '/');
    this.cookieService.delete('email', '/');
    this.cookieService.delete('name', '/');
    this.cookieService.delete('employee_id', '/');
    this.cookieService.delete('created_at', '/');
    this.cookieService.delete('profile_photo_url', '/');

    this.cookieService.delete('office_name', '/');
    this.cookieService.delete('lat', '/');
    this.cookieService.delete('long', '/');

    this.navCtrl.navigateRoot('/');
  }
}
