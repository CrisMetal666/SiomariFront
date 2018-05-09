import { Injectable } from '@angular/core';
import { url } from './var.const';
import { HttpClient } from '@angular/common/http';
import { ManejoAgua } from '../_model/manejo-agua';

@Injectable()
export class ManejoAguaService {

  private url: string;

  constructor(
    private http: HttpClient
  ) {
    this.url = `${url}manejoAgua/`
  }

  registrar(manejoAgua: ManejoAgua) {
    return this.http.post<ManejoAgua>(this.url, manejoAgua, { observe: 'response' });
  }

}
