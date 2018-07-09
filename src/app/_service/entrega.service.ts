import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { url } from './var.const';
import { Entrega } from '../_model/entrega';
import { EntregaInfo } from '../_model/entrega-info';
import { DistribucionAgua } from '../_model/distribucionAgua';
import { Facturacion } from '../_model/facturacion';
import { HeaderToken } from './header-token';

@Injectable()
export class EntregaService {

  private url: string;
  // objeto que contrira el header de autorizacion
  private header: HeaderToken;

  constructor(
    private http: HttpClient
  ) {
    this.url = `${url}entrega/`;
    this.header = new HeaderToken();
  }

  registrar(entrega: Entrega) {
    return this.http.post<Entrega>(this.url, entrega,
      this.header.getHeader()
    );
  }

  /**
   * se consultara el caudal que se lleva servido al predio dentro del rango establecido
   * @param inicio fecha inferior (yyyy-mm-dd)
   * @param fin fecha superior (yyyy-mm-dd)
   * @param predio id del predio
   */
  caudalServidoPorRangoFecha(inicio: string, fin: string, predio: number) {
    return this.http.get<Facturacion>(`${this.url}caudalServidoPorRangoFecha?inicio=${inicio}&fin=${fin}&predio=${predio}`,
    this.header.getHeader()
  );
  }

  /**
   * se consultara la distrubucion de agua en el mes, caudales servidos, derivados, laminas brutas y netas, y eficiencias
   * @param id id del canal, seccion, zona o unidad
   * @param tipo dira si se trata de una unidad, zona, seccion o canal. 1 = unidad, 2 = zona, 3 = seccion, 4 = canal
   * @param fecha fecha donde contenga el mes a consultar
   */
  distribucionAgua(id: number, tipo: number, fecha: Date) {

    let txtFecha = this.dateToString(fecha);

    return this.http.get<DistribucionAgua[]>(`${this.url}distribucionDeAgua?tipo=${tipo}&id=${id}&fecha=${txtFecha}`,
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
}
