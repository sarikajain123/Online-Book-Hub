import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class HttpService {
  baseUrl = 'http://skunkworks.ignitesol.com:8000/';
  constructor(public http: HttpClient) { }

  get_Data(
    url: string
  ): Observable<any> {
    const headers = new HttpHeaders({
      Accept: 'application/json'
    });
    const reqURL = this.baseUrl + url;
    return this.http
      .get(reqURL, { headers: headers }).pipe(map((res: Response) => {
        return res;
      }));
  }
}
