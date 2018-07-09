import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { url } from './var.const';
import { Unidad } from '../_model/unidad';
import { Canal } from '../_model/canal';
import { HeaderToken } from './header-token';

@Injectable()
export class UnidadService {

  private url: string;
  // objeto que contrira el header de autorizacion
  private header: HeaderToken;

  constructor(
    private http: HttpClient
  ) {
    this.url = `${url}unidad/`;
    this.header = new HeaderToken();
  }

  registrar(unidad: Unidad) {
    return this.http.post<Unidad>(`${this.url}`, unidad,
      this.header.getHeader()
    );
  }

  editar(unidad: Unidad) {
    return this.http.put<Unidad>(`${this.url}`, unidad,
      this.header.getHeader()
    );
  }

  listarTodos() {
    return this.http.get<Unidad[]>(`${this.url}`,
      this.header.getHeader()
    );
  }

  /**
   * Se verificara si existe una unidad por su nombre
   * @param nombre 
   * @returns true si existe, false si no existe
   */
  existePorNombre(nombre: string) {
    // se deben reemplazar los espacion es blanco con '+'
    return this.http.get<any>(`${this.url}existe/nombre/${nombre.replace(' ', '+')}`,
      this.header.getHeader()
    );
  }

  /**
   * actualizara el canal servidor
   * @param id id de la unidad
   * @param servidor id del canal servidor
   */
  updateCanalServidor(id: number, servidor: number) {

    return this.http.put(`${this.url}canalServidor/${id}/${servidor}`,
      this.header.getHeader()
    );
  }

  /**
   * se buscara el canal servidor por su id
   * @param id id de la unidad
   */
  buscarCanalServidorPorId(id: number) {

    return this.http.get<Canal>(`${this.url}buscarCanalServidorPorId/${id}`,
      this.header.getHeader()
    );
  }
}
