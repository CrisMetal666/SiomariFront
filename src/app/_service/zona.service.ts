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

  /**
   * se buscara las zonas que pertenescan a una unidad
   * @param id id de la unidad
   * @returns lista de zonas
   */
  buscarPorUnidadId(id: number) {
    return this.http.get<Zona[]>(`${url}/zona/unidadId/${id}`);
  }

  /**
   * se verificara si existe una zona por su nombre e id de la unidad
   * @param nombre nombre de la zona
   * @param unidad id de la unidad
   * @returns true si existe, false si no existe
   */
  existePorNombreYUnidad(nombre: string, unidad: number){
    //los espacios en blanco se deben reemplazar por '+'
    return this.http.get<any>(`${url}zona/existe/nombreYUnidad/${nombre.replace(' ', '+')}/${unidad}`);
  }
}
