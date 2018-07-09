import { Injectable } from '@angular/core';
import { url } from './var.const';
import { HttpClient } from '@angular/common/http';
import { ManejoAgua } from '../_model/manejo-agua';
import { EficienciaPerdidas } from '../_model/eficiencia-perdidas';
import { HeaderToken } from './header-token';

@Injectable()
export class ManejoAguaService {

  private url: string;
  // objeto que contrira el header de autorizacion
  private header: HeaderToken;

  constructor(
    private http: HttpClient
  ) {
    this.url = `${url}manejoAgua/`
    this.header = new HeaderToken();
  }

  registrar(manejoAgua: ManejoAgua) {
    return this.http.post<ManejoAgua>(this.url, manejoAgua, {
      observe: 'response',
      headers: this.header.header()
    });
  }

  /**
	 * se calculara la eficiencia, lamina neta, lamina bruta de un canal, seccion,
	 * zona, unidad en el rango de fecha especificado
	 * 
	 * @param fecha1
	 *            fecha inferior
	 * @param fecha2
	 *            fecha superior
	 * @param id
	 *            id de la unidad, zona, seccion o canal
	 * @param tipo
	 *            dira si se trata de unidad, zona, seccion o canal. 1 = unidad, 2 =
	 *            zona, 3 = seccion, 4 = canal
	 * @return caculo ficiencia, lamina neta, lamina bruta en cada fecha que hubo
	 *         registro dentro del rango
	 */
  calcularLanLamEfic(fecha1: Date, fecha2: Date, id: number, tipo: number) {

    let txtFecha1: string = this.dateToString(fecha1);
    let txtFecha2: string = this.dateToString(fecha2);

    return this.http.get<Array<Array<number>>>(`${this.url}calcularLanLamEfic?fecha1=${txtFecha1}&fecha2=${txtFecha2}&id=${id}&tipo=${tipo}`,
      this.header.getHeader()
    );
  }

  /**
   * se devuleve la fecha en formato yyyy-mm-dd
   * @param fecha fecha a parcear
   * @return fecha en texto
   */
  private dateToString(fecha: Date): string {

    let dia: number = fecha.getDate();
    let mes: number = fecha.getMonth() + 1;
    let diaString: string = dia < 10 ? '0' + dia : '' + dia;
    let mesString: string = mes < 10 ? '0' + mes : '' + mes;

    return `${fecha.getFullYear()}-${mesString}-${diaString}`;
  }

  calcularEficienciaPerdidas(id: number, tipo: number, fecha1: Date, fecha2: Date) {

    let txtFecha1: string = this.dateToString(fecha1);
    let txtFecha2: string = this.dateToString(fecha2);

    return this.http.get<EficienciaPerdidas>(`${this.url}calcularEficienciaPerdidas?id=${id}&tipo=${tipo}&fecha1=${txtFecha1}&fecha2=${txtFecha2}`,
      this.header.getHeader()
    );
  }

}
