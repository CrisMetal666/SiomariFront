import { Injectable } from '@angular/core';
import { Cultivo } from '../_model/cultivo';
import { HttpClient } from '@angular/common/http';
import { url } from './var.const';

@Injectable()
export class CultivoService {

  constructor(
    private http: HttpClient
  ) { }

  registrar(cultivo: Cultivo) {
    return this.http.post<Cultivo>(`${url}cultivo`, cultivo);
  }

  existeCultivo(nombre: string) {
    return this.http.get(`${url}cultivo/existe/nombre/${nombre.replace(' ', '+')}`);
  }

}
