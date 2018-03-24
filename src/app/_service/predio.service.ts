import { Injectable } from '@angular/core';
import { url } from './var.const';
import { Predio } from '../_model/predio';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class PredioService {

  private url: string;
  //Se usara en los autocompleter
  public urlBuscarIdCodigoNombrePorNombreOCodigo: string;

  constructor(
    private http: HttpClient
  ) {
    this.url = `${url}predio/`;
    this.urlBuscarIdCodigoNombrePorNombreOCodigo= `${this.url}nombreOCodigo?s=`;
  }

  registrar(predio: Predio) {
    return this.http.post<Predio>(`${url}predio`, predio);
  }

  editar(predio: Predio) {
    return this.http.put<Predio>(`${url}predio`, predio);
  }

  /**
   * se buscara un predio por su codigo
   * @param codigo 
   * @returns true si existe el predio, false si no existe
   */
  existePorCodigo(codigo: string) {
    return this.http.get<any>(`${this.url}existe/codigo/${codigo}`);
  }

  /**
   * se listaran todos los predios que no tengan un usuario registrado
   * @returns lista de predios
   */
  listarSinUsuarios() {
    return this.http.get<Predio[]>(`${this.url}sinUsuarios`);
  }

  /**
   * se listaran todos los predios
   * @returns los predios solo tendran el id, nombre, codigo y areatotal
   */
  datosBasicos() {
    return this.http.get<Predio[]>(`${this.url}datosBasicos`);
  }

  /**
   * se listaran los predios donde en el nombre o codigo contangan la cadena especificada
   * @param query cadena de consulta
   * @returns lista de predios con solo el id, codigo y nombre
   */
  listarIdCodigoNombrePorNombreOCodigo(query: string) {
    return this.http.get<Predio[]>(`${this.url}nombreOCodigo?s=${query}`);
  }

  /**
   * se buscara el predio por su id
   * @param id 
   * @returns predio con toda su informacion
   */
  buscarPorId(id: number) {
    return this.http.get<Predio>(`${this.url}${id}`);
  }

}
