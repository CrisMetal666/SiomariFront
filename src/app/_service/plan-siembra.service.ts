import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { url } from './var.const';
import { PlanSiembra } from '../_model/plan-siembra';

@Injectable()
export class PlanSiembraService {

  private url: string;

  constructor(
    private http: HttpClient
  ) {
    this.url = `${url}planSiembra/`;
  }

  /**
   * se buscara el plan de siembra que coincida con el año, mes y perido, si no existe se creara
   * @param year año
   * @param mes 
   * @param periodo 
   * @returns id del plan de siembra
   */
  buscarIdPorYearMesPeriodo(fecha: Date) {

    let year = fecha.getFullYear();
    let month = fecha.getMonth() + 1;
    let day = fecha.getDate();
    let periodo: number = this.calcularPeriodo(day);

    return this.http.get<PlanSiembra>(`${this.url}YearMesPeriodo/${year}/${month}/${periodo}`);
  }

  /**
   * calcula el periodo por la fecha establecida
   * @param fecha 
   * @returns periodo
   */
  private calcularPeriodo(day: number): number {

    let periodo: number = 0;

    if (day <= 10) {
      periodo = 1;
    } else if (day >= 11 && day <= 20) {
      periodo = 2;
    } else {
      periodo = 3;
    }

    return periodo;
  }

}
