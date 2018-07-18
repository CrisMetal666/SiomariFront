import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CanalObra } from '../_model/canal-obra';
import { url } from './var.const';
import { HeaderToken } from './header-token';

@Injectable()
export class CanalObraService {

  // url en comun del service
  private url: string;

  // objeto que contrira el header de autorizacion
  private header: HeaderToken;

  constructor(
    private http: HttpClient
  ) {
    this.url = `${url}canalObra/`;
    this.header = new HeaderToken();
  }



  /**
   * se buscara todas las obras de un canal
   * @param id id del canal
   */
  buscarIdNombrePorCanalId(id: number) {
    return this.http.get<CanalObra[]>(`${this.url}buscarIdNombrePorCanalId/${id}`,
      this.header.getHeader()
    );
  }

  /**
   * se guardara la informacion enviada
   * @param canalObra informacion a registrar
   * @param file imagen a guardar
   */
  guardar(canalObra: CanalObra, file: File) {

    let formdata: FormData = new FormData();
    formdata.append('file', file);
    formdata.append('body', JSON.stringify(canalObra)
    );

    return this.http.post<number>(`${this.url}`, formdata,
      this.header.getHeaderSendFile()
    );
  }

  /**
   * se buscara la informacion del canal obra
   * @param id id del canalObra
   */
  buscarPorId(id: number) {

    return this.http.get<CanalObra>(`${this.url}${id}`,
      this.header.getHeader()
    );
  }

  /**
   * se traeran los bytes de la imagen de la obra
   * @param nombre nombre de la imagen
   */
  verImagen(nombre: string) {

    return this.http.get(`${this.url}verImagen?name=${nombre}`,
      {
        responseType: 'blob',
        headers: this.header.header()
      });
  }

  /**
   * se eliminara un registro
   * @param id id del canal obra
   */
  eliminar(id: number) {

    return this.http.delete<boolean>(`${this.url}${id}`,
      this.header.getHeader()
    );
  }

}
