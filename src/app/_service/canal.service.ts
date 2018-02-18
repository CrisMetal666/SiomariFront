import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { url } from './var.const';
import { Canal } from '../_model/canal';

@Injectable()
export class CanalService {

  constructor(
    private http: HttpClient
  ) { }

  existeCanalPorCodigo(codigo: string) {
    return this.http.get<any>(`${url}canal/existe/codigo/${codigo}`);
  }

  registrar(canal: Canal) {
    return this.http.post<Canal>(`${url}canal`, canal);
  }

}
