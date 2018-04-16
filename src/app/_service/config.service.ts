import { Injectable } from '@angular/core';
import { url } from './var.const';
import { Config } from '../_model/config';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ConfigService {

  private url: string;

  constructor(
    private http: HttpClient
  ) { 
    this.url = `${url}config/`;
  }

  /**
   * se registrara el modelo
   * @param config datos a registrar
   */
  registrar(config: Config) {
    return this.http.post(this.url, config);
  }

  /**
   * se listara los datos basicos
   */
  listar() {
    return this.http.get<Config>(this.url);
  }

}
