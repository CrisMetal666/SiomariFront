import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Zona } from '../_model/zona';
import { url } from './var.const';

@Injectable()
export class ZonaService {

  private url: string;

  constructor(
    private http: HttpClient
  ) { 
    this.url = `${url}/zona/`;
  }

  registrar(zona: Zona) {
    return this.http.post<Zona>(`${this.url}`, zona);
  }

  editar(zona: Zona) {
    return this.http.put<Zona>(`${this.url}`, zona);
  }

  /**
   * se buscara las zonas que pertenescan a una unidad
   * @param id id de la unidad
   * @returns lista de zonas
   */
  buscarPorUnidadId(id: number) {
    return this.http.get<Zona[]>(`${this.url}unidadId/${id}`);
  }

  /**
   * se verificara si existe una zona por su nombre e id de la unidad
   * @param nombre nombre de la zona
   * @param unidad id de la unidad
   * @returns true si existe, false si no existe
   */
  existePorNombreYUnidad(nombre: string, unidad: number){
    //los espacios en blanco se deben reemplazar por '+'
    return this.http.get<any>(`${this.url}existe/nombreYUnidad/${nombre.replace(' ', '+')}/${unidad}`);
  }
}