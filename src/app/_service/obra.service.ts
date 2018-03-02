import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { url } from './var.const';
import { Obra } from '../_model/obra';

@Injectable()
export class ObraService {

  constructor(
    private http: HttpClient
  ) { }

  registrar(unidad: Obra) {
    return this.http.post<Obra>(`${url}obra`, unidad);
  }

  listar() {
    return this.http.get<Obra[]>(`${url}obra`);
  }

  /**
   * Se verificara si existe una obra por su nombre
   * @param nombre 
   * @returns true si existe, false si no existe
   */
  existePorNombre(nombre: string) {
    // se deben reemplazar los espacion es blanco con '+'
    return this.http.get<any>(`${url}obra/existe/nombre/${nombre.replace(' ', '+')}`);
  }

}
