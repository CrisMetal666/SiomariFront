import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { url } from './var.const';
import { Entrega } from '../_model/entrega';
import { EntregaInfo } from '../_model/entrega-info';

@Injectable()
export class EntregaService {

  private url: string;

  constructor(
    private http: HttpClient
  ) {
    this.url = `${url}entrega/`;
  }

  registrar(entrega: Entrega) {
    return this.http.post<Entrega>(this.url, entrega);
  }

  /**
   * se consultara el caudal que se lleva servido al predio dentro del rango establecido
   * @param inicio fecha inferior (yyyy-mm-dd)
   * @param fin fecha superior (yyyy-mm-dd)
   * @param predio id del predio
   */
  caudalServidoPorRangoFecha(inicio: string, fin: string, predio: number) {
    return this.http.get<EntregaInfo[]>(`${this.url}caudalServidoPorRangoFecha?inicio=${inicio}&fin=${fin}&predio=${predio}`);
  }



}
