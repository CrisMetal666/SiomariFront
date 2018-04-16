import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { url } from './var.const';
import { CultivoPredio } from '../_model/cultivo-predio';
import { PlaneacionInfo } from '../_model/planeacion-info';

@Injectable()
export class CultivoPredioService {

  private url: string;

  constructor(
    private http: HttpClient
  ) {
    this.url = `${url}cultivoPredio/`;
  }

  /**
   * se guardaran los cultivoPredio
   * @param cultivoPredio lista de cultivoPredio 
   */
  guardarLista(cultivoPredio: CultivoPredio[]) {
    return this.http.post(`${this.url}list`, cultivoPredio);
  }

   /**
   * se guardara el cultivoPredio
   * @param cultivoPredio 
   */
  guardar(cultivoPredio: CultivoPredio) {
    return this.http.post<CultivoPredio>(this.url, cultivoPredio);
  }

  /**
   * listara el cultivoPredio donde conincida con los parametros
   * @param predio id del predio
   * 
   */
  buscarPorPredioIdPlanSiembraId(predio: number, planSiembra: number) {
      return this.http.get<CultivoPredio[]>(`${this.url}predioIdPlanSiembraId/${predio}/${planSiembra}`);
  }

  /**
   * se traera la cantidad de cultivos sembradas en cada mes, perido de la campaña especificada,
   * el cultivo y el año
   * @param cultivo id del cultivo
   * @param year año
   * @param campania campaña, debe de ser A, B sependiendo de los meses que se desean ver
   * A (1 - 6), B (7 - 12)
   */
  planeacionInfo(cultivo: number, year: number, campania: string) {

    return this.http.get<PlaneacionInfo[]>(`${this.url}planeacionInfo/${cultivo}/${year}/${campania}`);
  }

  /**
   * se traera la informacion de siembra de todos los cultivos, cuantas hectareas fueron sembradas
   * en cada mes que se haya hecho, y en cada mes se calculara la demanda de agua
   * @param year año de la campaña
   * @param campania campaña (A - B)
   */
  planeacionInfoDemanda(year: number, campania: string) {

    return this.http.get<any>(`${this.url}planeacionInfoDemanda/${year}/${campania}`);
  }

  /**
   * consultara la demanda de cadal total mensual de todos los cultivos
   * @param year año de la campaña
   * @param campania campaña(A - B)
   */
  demandaTotalDecadal(year: number, campania: string) {

    return this.http.get<any>(`${this.url}demandaTotalDecadal/${year}/${campania}`);
  }


}
