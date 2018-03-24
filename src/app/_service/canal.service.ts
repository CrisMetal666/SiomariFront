import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { url } from './var.const';
import { Canal } from '../_model/canal';

@Injectable()
export class CanalService {

  private url: string;
  //usado para los autocompleter
  public urlListarPorNombreOCodigo: string;

  constructor(
    private http: HttpClient
  ) { 
    this.url = `${url}canal/`;
    this.urlListarPorNombreOCodigo = `${this.url}buscarPorNombreOCodigo?s=`;
  }

  existeCanalPorCodigo(codigo: string) {
    return this.http.get<any>(`${this.url}existe/codigo/${codigo}`);
  }

  registrar(canal: Canal) {
    return this.http.post<Canal>(`${this.url}`, canal);
  }

  editar(canal: Canal) {
    return this.http.put<Canal>(`${this.url}`, canal);
  }

  buscarPorSeccionId(id: number) {
    return this.http.get<Canal[]>(`${this.url}seccionId/${id}`);
  }

  listar() {
    return this.http.get<Canal[]>(`${this.url}`);
  }

  /**
   * se consultara la informacion del canal por su id
   * @param id 
   */
  buscarPorId(id: number) {
    return this.http.get<Canal>(`${this.url}${id}`);
  }

}
