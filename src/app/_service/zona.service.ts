import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Zona } from '../_model/zona';
import { url } from './var.const';

@Injectable()
export class ZonaService {

  constructor(
    private http: HttpClient
  ) { }

  registrar(zona: Zona) {
    return this.http.post<Zona>(`${url}/zona`, zona);
  }

  buscarPorUnidadId(id: number) {
    return this.http.get<Zona[]>(`${url}/zona/unidadId/${id}`);
  }

}
