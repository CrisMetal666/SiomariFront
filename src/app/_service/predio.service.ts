import { Injectable } from '@angular/core';
import { url } from './var.const';
import { Predio } from '../_model/predio';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class PredioService {

  constructor(
    private http: HttpClient
  ) { }

  registrar(predio: Predio) {
    return this.http.post<Predio>(`${url}predio`, predio);
  }

  /**
   * se buscara un predio por su codigo
   * @param codigo 
   * @returns true si existe el predio, false si no existe
   */
  existePorCodigo(codigo: string) {
    return this.http.get<any>(`${url}predio/existe/codigo/${codigo}`);
  }

  /**
   * se listaran todos los predios que no tengan un usuario registrado
   * @returns lista de predios
   */
  listarSinUsuarios() {
    return this.http.get<Predio[]>(`${url}predio/sinUsuarios`);
  }

}
