import { Injectable } from '@angular/core';
import { url } from './var.const';
import { HttpClient } from '@angular/common/http';
import { Usuario } from '../_model/usuario';

@Injectable()
export class UsuarioService {

  constructor(
    private http: HttpClient
  ) { }

  registrar(usuario: Usuario) {
    return this.http.post<Usuario>(`${url}usuario`, usuario);
  }

  /**
   * se buscara un usuario por su cedula
   * @param cedula 
   * @returns true si existe, false si no existe
   */
  existePorCedula(cedula: string) {
    return this.http.get<any>(`${url}usuario/existe/identificacion/${cedula}`);
  }

}
