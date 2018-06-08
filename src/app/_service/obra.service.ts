import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { url } from './var.const';
import { Obra } from '../_model/obra';

@Injectable()
export class ObraService {

  private url: string;
  //url usada para autocompleter
  public urlBuscarPorNombre: string;

  constructor(
    private http: HttpClient
  ) { 
    this.url = `${url}obra/`;
    this.urlBuscarPorNombre = `${this.url}nombre?s=`;
  }

  registrar(unidad: Obra) {
    return this.http.post<Obra>(`${this.url}`, unidad);
  }

  editar(unidad: Obra) {
    return this.http.put<Obra>(`${this.url}`, unidad);
  }

  listar() {
    return this.http.get<Obra[]>(`${this.url}`);
  }

  /**
   * Se verificara si existe una obra por su nombre
   * @param nombre 
   * @returns true si existe, false si no existe
   */
  existePorNombre(nombre: string) {
    // se deben reemplazar los espacion es blanco con '+'
    return this.http.get<any>(`${this.url}existe/nombre/${nombre.replace(' ', '+')}`);
  }

}
