import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { url } from './var.const';
import { Seccion } from '../_model/seccion';
import { Canal } from '../_model/canal';
import { HeaderToken } from './header-token';

@Injectable()
export class SeccionService {

  private url: string;
  // objeto que contrira el header de autorizacion
  private header: HeaderToken;

  constructor(
    private http: HttpClient
  ) {
    this.url = `${url}seccion/`;
    this.header = new HeaderToken();
  }

  registrar(seccion: Seccion) {
    return this.http.post<Seccion>(`${this.url}`, seccion,
      this.header.getHeader()
    );
  }

  editar(seccion: Seccion) {
    return this.http.put<Seccion>(`${this.url}`, seccion,
      this.header.getHeader()
    );
  }

  /**
   * se buscara las secciones que pertenescan a una zona
   * @param id. Id de la seccion
   * @returns lista de secciones
   */
  buscarPorZonaId(id: number) {
    return this.http.get<Seccion[]>(`${this.url}zonaId/${id}`,
      this.header.getHeader()
    );
  }

  /**
   * se verificara si existe una seccion por su nombre e id de la zona
   * @param nombre nombre de la seccion
   * @param zona id de la zona
   * @returns true si existe, false si no existe
   */
  existePorNombreYZona(nombre: string, zona: number) {
    //los espacios en blanco se deben reemplazar por '+'
    return this.http.get<any>(`${this.url}existe/nombreYZona/${nombre.replace(' ', '+')}/${zona}`,
      this.header.getHeader()
    );
  }

  /**
   * actualizara el canal servidor
   * @param id id de la seccion
   * @param servidor id del canal servidor
   */
  updateCanalServidor(id: number, servidor: number) {

    return this.http.put(`${this.url}canalServidor/${id}/${servidor}`,
      this.header.getHeader()
    );
  }

  /**
   * se buscara el canal servidor por su id
   * @param id id de la seccion
   */
  buscarCanalServidorPorId(id: number) {

    return this.http.get<Canal>(`${this.url}buscarCanalServidorPorId/${id}`,
      this.header.getHeader()
    );
  }
}
