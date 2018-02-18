import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { url } from './var.const';
import { Seccion } from '../_model/seccion';

@Injectable()
export class SeccionService {

  constructor(
    private http: HttpClient
  ) { }

  registrar(seccion: Seccion) {
    return this.http.post<Seccion>(`${url}seccion`, seccion);
  }

  buscarPorZonaId(id: number) {
    return this.http.get<Seccion[]>(`${url}/seccion/zonaId/${id}`);
  }
}
