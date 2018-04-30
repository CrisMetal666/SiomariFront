import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { url } from './var.const';
import { EstructuraControl } from '../_model/estructura-control';

@Injectable()
export class EstructuraControlService {

  //url en comun
  public url: string;
  //url usado por los autocompletr
  public buscarPorCodigoUrl: string;
  public buscarCodigoCoeficienteExponentePorCodigo: string;

  constructor(
    private http: HttpClient
  ) {
    this.url = `${url}estructuraControl/`;
    this.buscarPorCodigoUrl = `${this.url}buscarPorCodigo?codigo=`;
    this.buscarCodigoCoeficienteExponentePorCodigo = `${this.url}buscarCodigoCoeficienteExponentePorCodigo?codigo=`;
  }

  registrar(estructuraControl: EstructuraControl) {
    return this.http.post<EstructuraControl>(this.url, estructuraControl);
  }

  calibrar(estructuraControl: EstructuraControl) {
    return this.http.post<EstructuraControl>(`${this.url}calibrar`, estructuraControl);
  }

  buscarIdPorCodigo(codigo: string) {
    return this.http.get<EstructuraControl>(`${this.url}buscarIdPorCodigo/${codigo}`);
  }

}
