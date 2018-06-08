import { Component, OnInit } from '@angular/core';
import { CompleterData, CompleterService, CompleterItem } from 'ng2-completer';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { CanalService } from '../../_service/canal.service';
import { UnidadService } from '../../_service/unidad.service';
import { ZonaService } from '../../_service/zona.service';
import { SeccionService } from '../../_service/seccion.service';
import { Canal } from '../../_model/canal';

@Component({
  selector: 'app-establecer-canales-distribucion',
  templateUrl: './establecer-canales-distribucion.component.html',
  styleUrls: ['./establecer-canales-distribucion.component.css']
})
export class EstablecerCanalesDistribucionComponent implements OnInit {

  //autocompleter
  public dataCanal: CompleterData;
  public dataUnidad: CompleterData;
  public dataSeccion: CompleterData;
  public dataZona: CompleterData;
  //id seleccionado en el autocompleter
  public idCanal: number;
  public idUnidad: number;
  public idZona: number;
  public idSeccion: number;
  // texto de los autocompleter
  public sCanal: string;
  public sUnidad: string;
  public sZona: string;
  public sSeccion: string;
  //segun el vlaor numerico, se mostrara un mensaje al usuario
  public estado: number;
  /*
  * determinara si se graficara los datos de una canal, seccion, zona o unidad
  * 1 = unidad
  * 2 = zona
  * 3 = seccion
  * por defecto sera 1
  */
  public tipo: number;
  // dira si se han seleccionado todos los autocompleter
  public valido: boolean;
  //true si ya se consulto el canal servidor, false si no se ha consultado
  public consultado: boolean;

  constructor(
    private completerService: CompleterService,
    private spinnerService: Ng4LoadingSpinnerService,
    private canalService: CanalService,
    private unidadService: UnidadService,
    private zonaService: ZonaService,
    private seccionService: SeccionService
  ) {
    this.tipo = 1;
    this.valido = false;
    this.consultado = false;
  }

  ngOnInit() {
    //inicializamos el autocompleter
    this.dataCanal = this.completerService.remote(this.canalService.urlListarPorNombreOCodigoServidores, 'nombre,codigo', 'nombre');

    // inicializamos el auto-completer de unidad
    this.spinnerService.show();

    this.unidadService.listarTodos().subscribe(res => {

      this.dataUnidad = this.completerService.local(res, 'nombre', 'nombre');
      this.spinnerService.hide();

    }, err => {
      this.estado = 0;
      this.spinnerService.hide();
    });
  }

  onSourceSelect(selected: CompleterItem) {

    this.idCanal = 0;

    if (selected) {
      this.idCanal = selected.originalObject.id;
    }
  }

  onUnidadSelect(selected: CompleterItem) {

    this.idUnidad = 0;
    this.valido = false;
    //limpiamos los autocompleter en cascada
    this.idZona = 0;
    this.sZona = '';
    this.idSeccion = 0;
    this.sSeccion = '';

    if (selected) {

      this.idUnidad = selected.originalObject.id;
      this.valido = true;

      // buscamos las zonas de la unidad solo si esta seleccionado zona o seccion 
      if (this.tipo != 1) {

        this.valido = false;

        this.spinnerService.show();

        this.zonaService.buscarPorUnidadId(this.idUnidad).subscribe(res => {

          this.dataZona = this.completerService.local(res, 'nombre', 'nombre');
          this.spinnerService.hide();

        }, err => {
          this.estado = 0;
          this.spinnerService.hide();
        });
      }
    }
  }

  onZonaSelect(selected: CompleterItem) {

    this.idZona = 0;
    this.valido = false;

    //limpiamos los valores de la seccion
    this.idSeccion = 0;
    this.sSeccion = '';

    if (selected) {

      this.idZona = selected.originalObject.id;
      this.valido = true;

      //se buscaran las secciones si esta seleccionado la seccion (radio boton)
      if (this.tipo == 3) {

        this.spinnerService.show();

        this.valido = false;

        this.seccionService.buscarPorZonaId(this.idZona).subscribe(res => {

          this.dataSeccion = this.completerService.local(res, 'nombre', 'nombre');
          this.spinnerService.hide();

        }, err => {
          this.estado = 0;
          this.spinnerService.hide();
        })
      }
    }
  }

  onSeccionSelect(selected: CompleterItem) {

    this.idSeccion = 0;
    this.valido = false;

    if (selected) {
      this.idSeccion = selected.originalObject.id;
      this.valido = true;
    }
  }

  /*
   * al seleccionar un item del radio button para mostrar los autocompleter
   * segun el item seleccionado 
   */
  onChange(event, form) {
    this.tipo = event.target.value;
    //reinisiamos los id de los autocompleter
    this.idUnidad = 0;
    this.idSeccion = 0;
    this.idZona = 0;
    this.idCanal = 0;
    this.sUnidad = '';
    this.sSeccion = '';
    this.sZona = '';
    this.sCanal = '';

    //reseteamos el form donde estan los autocompleter
    form.reset();
  }

  consultar() {

    this.idCanal = 0;
    this.sCanal = '';

    // verificamos si tenemos que consultar la unidad, zona o seccion
    if (this.tipo == 1) {

      this.consultarUnidad();

    } else if (this.tipo == 2) {

      this.consultarZona();

    } else if (this.tipo == 3) {

      this.consultarSeccion();

    } else return;
  }

  private consultarUnidad(): void {

    this.spinnerService.show();

    this.unidadService.buscarCanalServidorPorId(this.idUnidad).subscribe(res => {

      // tomamos accion dependiendo de la respuesta del servodor
      this.verificarConsulta(res);

    }, err => {
      this.estado = 0;
      this.spinnerService.hide();
    });
  }

  private consultarZona(): void {

    this.spinnerService.show();

    this.zonaService.buscarCanalServidorPorId(this.idZona).subscribe(res => {

      // tomamos accion dependiendo de la respuesta del servodor
      this.verificarConsulta(res);

    }, err => {
      this.estado = 0;
      this.spinnerService.hide();
    });
  }

  private consultarSeccion(): void {

    this.spinnerService.show();

    this.seccionService.buscarCanalServidorPorId(this.idSeccion).subscribe(res => {

      // tomamos accion dependiendo de la respuesta del servodor
      this.verificarConsulta(res);

    }, err => {
      this.estado = 0;
      this.spinnerService.hide();
    });
  }

  /*
   * verificamos si existe el canal servidor y los mostramos para ser editado
  */
  private verificarConsulta(res: Canal): void {

    this.estado = undefined;

    if (res != null) {
      this.sCanal = res.nombre;
      this.idCanal = res.id;
    }

    this.consultado = true;

    this.spinnerService.hide();
  }

  guardar() {

    // verificamos si tenemos que guardar la unidad, zona o seccion
    if (this.tipo == 1) {

      this.guardarUnidad();

    } else if (this.tipo == 2) {

      this.guardarZona();

    } else if (this.tipo == 3) {

      this.guardarSeccion();

    } else return;
  }

  private guardarUnidad(): void {

    this.spinnerService.show();

    this.unidadService.updateCanalServidor(this.idUnidad, this.idCanal).subscribe(res => {

      this.estado = 1;
      this.spinnerService.hide();
      this.consultado = false;

    }, err => {
      this.estado = 0;
      this.spinnerService.hide();
    });
  }

  private guardarZona(): void {

    this.spinnerService.show();

    this.zonaService.updateCanalServidor(this.idZona, this.idCanal).subscribe(res => {

      this.estado = 1;
      this.spinnerService.hide();
      this.consultado = false;

    }, err => {
      this.estado = 0;
      this.spinnerService.hide();
    });
  }

  private guardarSeccion(): void {

    this.spinnerService.show();

    this.seccionService.updateCanalServidor(this.idSeccion, this.idCanal).subscribe(res => {

      this.estado = 1;
      this.spinnerService.hide();
      this.consultado = false;

    }, err => {
      this.estado = 0;
      this.spinnerService.hide();
    });
  }

}
