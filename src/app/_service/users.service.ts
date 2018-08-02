import { Injectable } from '@angular/core';
import { HeaderToken } from './header-token';
import { HttpClient } from '@angular/common/http';
import { url } from './var.const';
import { Users } from '../_model/users';

@Injectable()
export class UsersService {

  private url: string;
  // objeto que contrira el header de autorizacion
  private header: HeaderToken;

  constructor(private http: HttpClient
  ) {
    this.url = `${url}users/`;
    this.header = new HeaderToken();
  }

  buscarPorIdentificacion(identificacion: string) {

    return this.http.get<Users>(`${this.url}identificacion/${identificacion}`,
      this.header.getHeader()
    );
  }

  registrar(users: Users) {

    return this.http.post<number>(`${this.url}`, users,
      this.header.getHeader()
    );
  }

  editar(users: Users) {

    return this.http.put<number>(`${this.url}`, users,
      this.header.getHeader()
    );
  }

  /**
   * se cambiara la contraseña de un usuario
   * @param users contraseña nueva y usuario
   */
  cambiarClave(users: Users) {

    return this.http.put<number>(`${this.url}clave`, users,
      this.header.getHeader()
    );
  }

  /**
   * se buscara si el usuario es nuevo
   * @param identificacion identificacion del usuario
   */
  buscarNuevoPorIdentificacion(identificacion: string) {

    return this.http.get<boolean>(`${this.url}nuevo/${identificacion}`,
      this.header.getHeader()
    );
  }

}
