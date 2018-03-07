import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ClimatologiaDatos } from '../_model/climatologia-datos';
import { url } from './var.const';


@Injectable()
export class ClimatologiaDatosService {

  constructor(
    private http: HttpClient
  ) { }

  /**
   * se traera los datos por mes y año especificado
   * @param mes se debe especificar del 1-12 siendo 1 = enero y 12 = diciembre
   * @param year año
   */
  datosPorMesYYear(mes: number, year: number) {
    return this.http.get<ClimatologiaDatos>(`${url}climatologiaDatos/mesYYear/${mes}/${year}`);
  }

}
