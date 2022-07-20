import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(
    private httpClient: HttpClient,
    private cookieService: CookieService
  ) {}
  baseUrl = 'https://attendance.tashicell.com/api';

  data: any;

  fetchMonthlyData() {
    let header: Headers = new Headers();

    header.set('Accept', 'text/html; charset-utf-8');
    header.append('Content-Type', 'application/json; charset-utf-8');

    return new Promise((resolve) => {
      this.httpClient
        .get(
          this.baseUrl +
            '/individual-monthly-report/' +
            this.cookieService.get('id')
        )
        .pipe()
        .subscribe(
          (data) => {
            this.data = data;
            resolve(data);
            // console.log(this.data.absent_days);
          },
          (error) => {
            let status = 'error';
            resolve(status);
          }
        );
    });
  }
}
