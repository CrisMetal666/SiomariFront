import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { url } from './var.const';
import { Unidad } from '../_model/unidad';

@Injectable()
export class UnidadService {

  constructor(
    private http: HttpClient
  ) { }

  registrar(unidad: Unidad) {
    return this.http.post<Unidad>(`${url}/unidad`, unidad);
  }

  listarTodos() {
    return this.http.get<Unidad[]>(`${url}/unidad`);
  }

}
