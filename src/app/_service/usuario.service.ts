import { Injectable } from '@angular/core';
import { url } from './var.const';
import { HttpClient } from '@angular/common/http';
import { Usuario } from '../_model/usuario';

@Injectable()
export class UsuarioService {

  private url: string;
  //usado por los autocompleter
  public urlBuscarPorIdentificacion: string;

  constructor(
    private http: HttpClient
  ) { 
    this.url = `${url}usuario/`;
    this.urlBuscarPorIdentificacion =  `${this.url}buscarPorIdentificacion?s=`;
  }

  registrar(usuario: Usuario) {
    return this.http.post<Usuario>(this.url, usuario);
  }

  editar(usuario: Usuario) {
    return this.http.put<Usuario>(this.url, usuario);
  }

  /**
   * se buscara un usuario por su cedula
   * @param cedula 
   * @returns true si existe, false si no existe
   */
  existePorCedula(cedula: string) {
    return this.http.get<any>(`${this.url}existe/identificacion/${cedula}`);
  }

  /**
   * se busca el usuario por su id
   * @param id 
   */
  buscarPorId(id: number) {
    return this.http.get<Usuario>(`${this.url}${id}`);
  }

}
