import { Injectable } from '@angular/core';
import { url } from './var.const';
import { Config } from '../_model/config';
import { HttpClient } from '@angular/common/http';
import { HeaderToken } from './header-token';

@Injectable()
export class ConfigService {

  private url: string;
  // objeto que contrira el header de autorizacion
  private header: HeaderToken;

  constructor(
    private http: HttpClient
  ) { 
    this.url = `${url}config/`;
    this.header = new HeaderToken();
  }

  /**
   * se registrara el modelo
   * @param config datos a registrar
   */
  registrar(config: Config) {
    return this.http.post(this.url, config,
      this.header.getHeader()
    );
  }

  /**
   * se listara los datos basicos
   */
  listar() {
    return this.http.get<Config>(this.url,
      this.header.getHeader()
    );
  }

}
