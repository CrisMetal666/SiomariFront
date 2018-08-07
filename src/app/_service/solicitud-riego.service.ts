import { Injectable } from '@angular/core';
import { HeaderToken } from './header-token';
import { HttpClient } from '@angular/common/http';
import { url } from './var.const';
import { SolicitudRiego } from '../_model/solicitud-riego';

@Injectable()
export class SolicitudRiegoService {

  private url: string;
  // objeto que contrira el header de autorizacion
  private header: HeaderToken;

  constructor(private http: HttpClient
  ) {
    this.url = `${url}solicitudRiego/`;
    this.header = new HeaderToken();
  }

  /**
   * se guardara la informacion
   * @param entity informacion a guardar
   */
  guardar(entity: SolicitudRiego) {
    return this.http.post<number>(`${this.url}`, entity,
      this.header.getHeader()
    );
  }

  /**
   * se eliminara un registro
   * @param id id del registro
   */
  eliminar(id: number) {
    return this.http.delete(`${this.url}${id}`,
      this.header.getHeader()
    );
  }

  /**
   * se consultara las solicitudes de riego en el mes actual
   * @param id id del predio
   */
  buscarPorMes(id: number) {

    // tomamos la fecha para hacer la consulta
    let strFecha = this.dateToString(new Date());

    return this.http.get<SolicitudRiego[]>(`${this.url}buscarPorMes/${id}?fecha=${strFecha}`,
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
