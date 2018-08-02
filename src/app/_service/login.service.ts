import { Injectable } from '@angular/core';
import { HOST, TOKEN_AUTH_USERNAME, TOKEN_AUTH_PASSWORD } from './var.const';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class LoginService {

  private url: string;

  constructor(
    private http: HttpClient
  ) {
    this.url = `${HOST}oauth/token`;
  }

  login(usuario: string, contrasena: string) {
    const body = `grant_type=password&username=${encodeURIComponent(usuario)}&password=${encodeURIComponent(contrasena)}`;

    return this.http.post<any>(this.url, body, {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8').set('Authorization', 'Basic ' + btoa(TOKEN_AUTH_USERNAME + ':' + TOKEN_AUTH_PASSWORD))
    });
  }

  

}
