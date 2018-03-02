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

  /**
   * se buscara las secciones que pertenescan a una zona
   * @param id. Id de la seccion
   * @returns lista de secciones
   */
  buscarPorZonaId(id: number) {
    return this.http.get<Seccion[]>(`${url}/seccion/zonaId/${id}`);
  }

  /**
   * se verificara si existe una seccion por su nombre e id de la zona
   * @param nombre nombre de la seccion
   * @param zona id de la zona
   * @returns true si existe, false si no existe
   */
  existePorNombreYZona(nombre: string, zona: number){
    //los espacios en blanco se deben reemplazar por '+'
    return this.http.get<any>(`${url}seccion/existe/nombreYZona/${nombre.replace(' ', '+')}/${zona}`);
  }
}
