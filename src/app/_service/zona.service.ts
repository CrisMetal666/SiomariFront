import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Zona } from '../_model/zona';
import { url } from './var.const';
import { Canal } from '../_model/canal';
import { HeaderToken } from './header-token';

@Injectable()
export class ZonaService {

  private url: string;
  // objeto que contrira el header de autorizacion
  private header: HeaderToken;

  constructor(
    private http: HttpClient
  ) {
    this.url = `${url}zona/`;
    this.header = new HeaderToken();
  }

  registrar(zona: Zona) {
    return this.http.post<Zona>(`${this.url}`, zona,
      this.header.getHeader()
    );
  }

  editar(zona: Zona) {
    return this.http.put<Zona>(`${this.url}`, zona,
      this.header.getHeader()
    );
  }

  /**
   * se buscara las zonas que pertenescan a una unidad
   * @param id id de la unidad
   * @returns lista de zonas
   */
  buscarPorUnidadId(id: number) {
    return this.http.get<Zona[]>(`${this.url}unidadId/${id}`,
      this.header.getHeader()
    );
  }

  /**
   * se verificara si existe una zona por su nombre e id de la unidad
   * @param nombre nombre de la zona
   * @param unidad id de la unidad
   * @returns true si existe, false si no existe
   */
  existePorNombreYUnidad(nombre: string, unidad: number) {
    //los espacios en blanco se deben reemplazar por '+'
    return this.http.get<any>(`${this.url}existe/nombreYUnidad/${nombre.replace(' ', '+')}/${unidad}`,
      this.header.getHeader()
    );
  }

  /**
 * actualizara el canal servidor
 * @param id id de la zona
 * @param servidor id del canal servidor
 */
  updateCanalServidor(id: number, servidor: number) {

    return this.http.put(`${this.url}canalServidor/${id}/${servidor}`,
      this.header.getHeader()
    );
  }

  /**
   * se buscara el canal servidor por su id
   * @param id id de la zona
   */
  buscarCanalServidorPorId(id: number) {

    return this.http.get<Canal>(`${this.url}buscarCanalServidorPorId/${id}`,
      this.header.getHeader()
    );
  }
}
