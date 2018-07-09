import { Injectable } from '@angular/core';
import { url } from './var.const';
import { HttpClient } from '@angular/common/http';
import { Usuario } from '../_model/usuario';
import { HeaderToken } from './header-token';

@Injectable()
export class UsuarioService {

  private url: string;
  //usado por los autocompleter
  public urlBuscarPorNombreCompletoOIdentificacion: string;
  // objeto que contrira el header de autorizacion
  private header: HeaderToken;

  constructor(
    private http: HttpClient
  ) {
    this.url = `${url}usuario/`;
    this.header = new HeaderToken();
    this.urlBuscarPorNombreCompletoOIdentificacion = `${this.url}buscarPorNombreCompletoOIdentificacion?access_token=${this.header.getToken()}&s=`;
  }

  registrar(usuario: Usuario) {
    return this.http.post<Usuario>(this.url, usuario,
      this.header.getHeader()
    );
  }

  editar(usuario: Usuario) {
    return this.http.put<Usuario>(this.url, usuario,
      this.header.getHeader()
    );
  }

  /**
   * se buscara un usuario por su cedula
   * @param cedula 
   * @returns true si existe, false si no existe
   */
  existePorCedula(cedula: string) {
    return this.http.get<any>(`${this.url}existe/identificacion/${cedula}`,
      this.header.getHeader()
    );
  }

  /**
   * se busca el usuario por su id
   * @param id 
   */
  buscarPorId(id: number) {
    return this.http.get<Usuario>(`${this.url}${id}`,
      this.header.getHeader()
    );
  }

}
