import { Injectable } from '@angular/core';
import { Cultivo } from '../_model/cultivo';
import { HttpClient } from '@angular/common/http';
import { url } from './var.const';
import { HeaderToken } from './header-token';

@Injectable()
export class CultivoService {

  //almacenara la cadena comun de todos los servicios REST
  private url: string;
  //usada en los autocompleter
  public urlBuscarIdNombrePorNombre: string;
  // objeto que contrira el header de autorizacion
  private header: HeaderToken;

  constructor(
    private http: HttpClient
  ) {
    this.url = `${url}cultivo/`;
    this.header = new HeaderToken();
    this.urlBuscarIdNombrePorNombre = `${this.url}nombre?access_token=${this.header.getToken()}&s=`;
  }

  registrar(cultivo: Cultivo) {
    return this.http.post<Cultivo>(`${this.url}`, cultivo,
      this.header.getHeader()
    );
  }

  editar(cultivo: Cultivo) {
    return this.http.put<Cultivo>(`${this.url}`, cultivo,
      this.header.getHeader()
    );
  }

  /**
   * se verificara si existe el cultivo por su nombre
   * @param nombre nombre del cultivo
   * @returns true si existe, false si no existe
   */
  existeCultivo(nombre: string) {
    return this.http.get(`${this.url}existe/nombre/${nombre.replace(' ', '+')}`,
      this.header.getHeader()
    );
  }

  /**
   * se listaran todos los cultivos
   * @returns los cultivos solo tendra id y nombre
   */
  datosBasicos() {
    return this.http.get<Cultivo[]>(`${this.url}datosBasicos`,
      this.header.getHeader()
    );
  }

  /**
   * se listaran los cultivos donde en el nombre contangan la cadena especificada
   * @param query cadena de consulta
   * @returns lista de cultivo con solo el id y nombre
   */
  listarIdNombrePorNombre(query: string) {
    return this.http.get<Cultivo[]>(`${this.url}nombre?=${query}`,
      this.header.getHeader()
    );
  }

  /**
   * se listara el cultivo por su id
   * @param id id del cultivo
   * @returns cultivo con toda su informacion
   */
  listarPorId(id: number) {
    return this.http.get<Cultivo>(`${this.url}${id}`,
      this.header.getHeader()
    );
  }

}
