import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { url } from './var.const';
import { Unidad } from '../_model/unidad';

@Injectable()
export class UnidadService {

  private url: string;

  constructor(
    private http: HttpClient
  ) {
    this.url = `${url}/unidad/`;
  }

  registrar(unidad: Unidad) {
    return this.http.post<Unidad>(`${this.url}`, unidad);
  }

  editar(unidad: Unidad) {
    return this.http.put<Unidad>(`${this.url}`, unidad);
  }

  listarTodos() {
    return this.http.get<Unidad[]>(`${this.url}`);
  }

  /**
   * Se verificara si existe una unidad por su nombre
   * @param nombre 
   * @returns true si existe, false si no existe
   */
  existePorNombre(nombre: string) {
    // se deben reemplazar los espacion es blanco con '+'
    return this.http.get<any>(`${this.url}existe/nombre/${nombre.replace(' ', '+')}`);
  }

}
