import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner/ngx';
import { AlertController } from '@ionic/angular';
import { CookieService } from 'ngx-cookie-service';
import { HTTP } from '@awesome-cordova-plugins/http/ngx';
import { DatePipe } from '@angular/common';
import { ToastController } from '@ionic/angular';
import { Vibration } from '@awesome-cordova-plugins/vibration/ngx';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
})
export class Tab2Page implements AfterViewInit {
  apiUrl = 'https://attendance.tashicell.com/api';
  httpOptions = { 'Content-Type': 'application/x-www-form-urlencoded' };
  paddingInline: boolean = false;

  data: any;

  @ViewChild('doughnutCanvas') private doughnutCanvas: ElementRef;

  doughnutChart: any;

  constructor(
    private barcodeScanner: BarcodeScanner,
    private http: HTTP,
    private cookieService: CookieService,
    private datePipe: DatePipe,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private vibration: Vibration,
    private httpClient: HttpClient
  ) {
    this.doughnutChartMethod();
  }

  async ngAfterViewInit() {
    this.doughnutChartMethod();
  }

  // user_id: any = this.cookieService.get('id');
  // checkin_time: any = this.datePipe.transform(
  //   new Date(),
  //   'yyyy-MM-dd HH:mm:ss'
  // );
  attendance_date: any = this.datePipe.transform(new Date(), 'yyyy-MM-dd');

  within = this.cookieService.get('within');
  today = this.datePipe.transform(this.attendance_date, 'MMMM dd, yyyy ');

  ionViewDidEnter() {
    this.scanQRCode();
  }

  doughnutChartMethod() {
    let header: Headers = new Headers();

    header.set('Accept', 'text/html; charset-utf-8');
    header.append('Content-Type', 'application/json; charset-utf-8');

    return new Promise((resolve) => {
      this.httpClient
        .get(
          this.apiUrl +
            '/individual-monthly-report/' +
            this.cookieService.get('id')
        )
        .pipe()
        .subscribe(
          (data) => {
            this.data = data;
            resolve(data);
            this.doughnutChart = new Chart(this.doughnutCanvas.nativeElement, {
              type: 'doughnut',
              data: {
                labels: ['Present', 'Absentees', 'Total days'],
                datasets: [
                  {
                    label: 'Attendance status',
                    data: [
                      this.data.presentDays,
                      this.data.absentDays,
                      this.data.noOfDaysInLastmonth,
                    ],
                    backgroundColor: [
                      'rgba(54, 162, 235, 0.7)',
                      'rgba(238, 116, 45, 0.7)',
                      'rgba(21, 54, 99, 0.7)',
                    ],
                    hoverBackgroundColor: [
                      'rgba(54, 162, 235)',
                      'rgb(238, 116, 28)',
                      'rgb(21, 54, 99)',
                    ],
                  },
                ],
              },
            });
          },
          (error) => {
            let status = 'error';
            resolve(status);
          }
        );
    });
  }

  async presentSuccessAlert() {
    const alert = await this.alertCtrl.create({
      cssClass: 'success-alert-style',
      header: ' Thank you',
      message: 'You are marked present for ' + this.today,
      buttons: [
        {
          text: 'OK',
          id: 'confirm-button',
          cssClass: 'confirm-button',
        },
      ],
    });
    await alert.present();
  }

  async presentInvalidToast() {
    let toast = this.toastCtrl.create({
      message: 'Invalid QR Code',
      duration: 2000,
      position: 'middle',
    });
    await (await toast).present();
  }

  async presentDoubleScanningToast() {
    let toast = this.toastCtrl.create({
      message: 'Scanned already',
      duration: 2000,
      position: 'middle',
    });
    await (await toast).present();
  }

  async presentOutofRangeWarningToast() {
    let toast = this.toastCtrl.create({
      message: 'Please make sure to scan from within the office area',
      duration: 2000,
      position: 'middle',
    });
    await (await toast).present();
  }

  async presentOutofRangeWarning() {
    const alert = await this.alertCtrl.create({
      cssClass: 'warning-alert-style',
      header: 'Warning!',
      message: 'Please make sure to scan from within the office area',
      buttons: [
        {
          text: 'OK',
          id: 'confirm-button',
          cssClass: 'alert-button',
        },
      ],
    });

    await alert.present();
    this.vibration.vibrate(1000);
  }

  postAttendance() {
    let attendanceData = {
      user_id: this.cookieService.get('id'),
      checkin_time: this.datePipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss'),
      attendance_date: this.attendance_date,
    };

    this.http
      .post(this.apiUrl + '/post-attendance', attendanceData, this.httpOptions)
      .then((data) => {
        if (data.data != 'duplicate_record') {
          this.vibration.vibrate(1000);
          this.presentSuccessAlert();
        } else {
          this.presentDoubleScanningToast();
        }
      })
      .catch((error) => {
        console.log(error.error);
      });
  }

  scanQRCode() {
    navigator.geolocation.getCurrentPosition((position) => {
      let d_lat: any = position.coords.latitude, // device latitude
        d_lon: any = position.coords.longitude, // device longitude
        // o_lat: any = 27.468531209527367, // office latitude
        // o_lon: any = 89.6407073377182; // office longitude
        o_lat: any = this.cookieService.get('lat'), // office latitude
        o_lon: any = this.cookieService.get('long'); // office longitude

      let p = 0.017453292519943295; // Math.PI / 180
      let c = Math.cos;
      let a =
        0.5 -
        c((o_lat - d_lat) * p) / 2 +
        (c(d_lat * p) * c(o_lat * p) * (1 - c((o_lon - d_lon) * p))) / 2;

      let distance = 12742 * Math.asin(Math.sqrt(a)) * 1000;

      if (distance <= 200) {
        this.barcodeScanner
          .scan({
            preferFrontCamera: false, // iOS and Android
            prompt: 'Place the QR code inside the scan area', // Android
            orientation: 'portrait', // Android only (portrait|landscape), default unset so it rotates with the device
            formats: 'QR_CODE,PDF_417', // default: all but PDF_417 and RSS_EXPANDED
            disableAnimations: true, // iOS
            resultDisplayDuration: 0, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
            disableSuccessBeep: false, // iOS and Android
          })
          .then((qrCodeDate) => {
            if (
              qrCodeDate.text ==
              this.datePipe.transform(new Date(), 'yyyy-MM-dd')
            ) {
              this.postAttendance();
            } else {
              this.presentInvalidToast();
            }
          })
          .catch((err) => {
            console.log('Error', err);
          });
      } else {
        this.presentOutofRangeWarningToast();
      }
    });
  }
}
