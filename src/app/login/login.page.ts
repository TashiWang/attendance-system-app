import { AuthService } from '../services/auth.service';
import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import {} from '@capacitor/core';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

import {
  AlertController,
  LoadingController,
  NavController,
} from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit, OnDestroy, AfterViewInit {
  inputEmail: any = '';
  inputPassword: any = '';
  userDtl: any;
  backButtonSubscription;
  baseUrl = 'https://attendance.tashicell.com/api';
  officeData: any;

  constructor(
    public authService: AuthService,
    private navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private alertController: AlertController,
    private platform: Platform,
    private httpClient: HttpClient,
    private cookieService: CookieService
  ) {}

  ngOnInit() {}
  ngAfterViewInit() {
    this.backButtonSubscription = this.platform.backButton.subscribe(() => {
      navigator['app'].exitApp();
    });
  }
  ngOnDestroy() {
    this.backButtonSubscription.unsubscribe();
  }

  async presentAlert(headermsg: any, msg: any) {
    const alert = await this.alertController.create({
      header: headermsg,
      cssClass: 'warning-alert-style',
      message: msg,
      buttons: ['OK'],
    });

    await alert.present();
  }

  //
  async presentLoading() {
    const loading = await this.loadingCtrl.create({
      spinner: 'bubbles',
      cssClass: 'ion-loading-class',
      duration: 3000,
    });
    await loading.present();

    // logging in
    if (this.inputEmail == '' || this.inputPassword == '') {
      loading.dismiss();
      this.presentAlert('Warning!', 'All fields are mandatory.');
    } else {
      this.authService
        .login(this.inputEmail, this.inputPassword)
        .then(
          (data) => {
            if (data == 'no_account') {
              loading.dismiss();
              this.presentAlert(
                'Sorry!',
                "User account doesn't exist or Credential is wrong"
              );
            } else if (data == 'invalid_password') {
              loading.dismiss();
              this.presentAlert('Invalid Password', 'Enter correct password');
            } else if (data == 'error') {
              loading.dismiss();
              this.presentAlert('Error', 'Server Error');
            } else {
              loading.dismiss();
              //navigate
              this.navCtrl.navigateRoot('/members');

              let header: Headers = new Headers();
              header.set('Accept', 'text/html; charset-utf-8');
              header.append('Content-Type', 'application/json; charset-utf-8');

              return new Promise((resolve) => {
                this.httpClient
                  .get(this.baseUrl + '/office/' + this.cookieService.get('id'))
                  .pipe()
                  .subscribe((data) => {
                    this.officeData = data;
                    resolve(this.officeData);

                    this.cookieService.delete('office_name', '/members');
                    this.cookieService.delete('lat', '/members');
                    this.cookieService.delete('long', '/members');

                    this.cookieService.set(
                      'office_name',
                      this.officeData[0].office_name
                    );
                    this.cookieService.set('lat', this.officeData[0].lat);
                    this.cookieService.set('long', this.officeData[0].long);
                  });
              });
            }
          },
          (error) => {
            this.presentAlert('Error', 'No Internet connection');
          }
        )
        .catch(() => {
          this.presentAlert('Error', 'No Internet connection');
        });
    }
  }
}
