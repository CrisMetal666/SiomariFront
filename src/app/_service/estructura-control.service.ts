import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { url } from './var.const';
import { EstructuraControl } from '../_model/estructura-control';
import { HeaderToken } from './header-token';

@Injectable()
export class EstructuraControlService {

  //url en comun
  public url: string;
  //url usado por los autocompletr
  public buscarPorCodigoUrl: string;
  public buscarCodigoCoeficienteExponentePorCodigo: string;
  // objeto que contrira el header de autorizacion
  private header: HeaderToken;

  constructor(
    private http: HttpClient
  ) {
    this.header = new HeaderToken();
    this.url = `${url}estructuraControl/`;
    this.buscarPorCodigoUrl = `${this.url}buscarPorCodigo?access_token=${this.header.getToken()}&codigo=`;
    this.buscarCodigoCoeficienteExponentePorCodigo = `${this.url}buscarCodigoCoeficienteExponentePorCodigo?access_token=${this.header.getToken()}&codigo=`;
  }

  registrar(estructuraControl: EstructuraControl) {
    return this.http.post<EstructuraControl>(this.url, estructuraControl,
      this.header.getHeader()
    );
  }

  calibrar(estructuraControl: EstructuraControl) {
    return this.http.post<EstructuraControl>(`${this.url}calibrar`, estructuraControl,
      this.header.getHeader()
    );
  }

  buscarIdPorCodigo(codigo: string) {
    return this.http.get<EstructuraControl>(`${this.url}buscarIdPorCodigo/${codigo}`,
      this.header.getHeader()
    );
  }

}
