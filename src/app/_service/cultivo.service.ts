import { Injectable } from '@angular/core';
import { Cultivo } from '../_model/cultivo';
import { HttpClient } from '@angular/common/http';
import { url } from './var.const';

@Injectable()
export class CultivoService {

  //almacenara la cadena comun de todos los servicios REST
  private url: string;
  //usada en los autocompleter
  public urlBuscarIdNombrePorNombre: string;
  

  constructor(
    private http: HttpClient
  ) {
    this.url = `${url}cultivo/`;
    this.urlBuscarIdNombrePorNombre= `${this.url}nombre?s=`;
  }

  registrar(cultivo: Cultivo) {
    return this.http.post<Cultivo>(`${this.url}`, cultivo);
  }

  editar(cultivo: Cultivo) {
    return this.http.put<Cultivo>(`${this.url}`, cultivo);
  }

  /**
   * se verificara si existe el cultivo por su nombre
   * @param nombre nombre del cultivo
   * @returns true si existe, false si no existe
   */
  existeCultivo(nombre: string) {
    return this.http.get(`${this.url}existe/nombre/${nombre.replace(' ', '+')}`);
  }

  /**
   * se listaran todos los cultivos
   * @returns los cultivos solo tendra id y nombre
   */
  datosBasicos() {
    return this.http.get<Cultivo[]>(`${this.url}datosBasicos`);
  }

  /**
   * se listaran los cultivos donde en el nombre contangan la cadena especificada
   * @param query cadena de consulta
   * @returns lista de cultivo con solo el id y nombre
   */
  listarIdNombrePorNombre(query: string) {
    return this.http.get<Cultivo[]>(`${this.url}nombre?=${query}`);
  }

  /**
   * se listara el cultivo por su id
   * @param id id del cultivo
   * @returns cultivo con toda su informacion
   */
  listarPorId(id: number) {
    return this.http.get<Cultivo>(`${this.url}/${id}`);
  }

}
