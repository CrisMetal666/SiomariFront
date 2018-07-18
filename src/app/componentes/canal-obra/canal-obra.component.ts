import { Component, OnInit, TemplateRef } from '@angular/core';
import { CanalObra } from '../../_model/canal-obra';
import { CanalService } from '../../_service/canal.service';
import { ObraService } from '../../_service/obra.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { Obra } from '../../_model/obra';
import { CompleterService, CompleterData, CompleterItem } from 'ng2-completer';
import { CanalObraService } from '../../_service/canal-obra.service';
import { Canal } from '../../_model/canal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-canal-obra',
  templateUrl: './canal-obra.component.html',
  styleUrls: ['./canal-obra.component.css']
})
export class CanalObraComponent implements OnInit {

  // mostrara u ocultara el formulario de registro
  mostrarForm: boolean;
  // mostrara u ocultara el boton para mostrar la imagen
  mostrarBotonImagen: boolean;
  // true si ya se ha seleccionado un canal
  seleccionado: boolean;
  // lista de obras del canal seleccionado
  lstCanalObra: CanalObra[];
  // dependiendo del valor numerico mostrara un mensaje al usuario
  estado: number;
  // variables necesaria para los autocompleter de canal y obra
  dataServiceCanal: CompleterData;
  dataServiceObra: CompleterData;
  completerCanal: string;
  completerObra: string;
  idCanal: number;
  idObra: number;
  // objeto que se mostrara en el formulario
  canalObra: CanalObra;
  // objeto donde se almacena la imagen seleccionada
  selectedFiles: FileList;
  // modal para visualizar la imagen
  modalRef: BsModalRef;
  // variables necesarias para la visualizacion de la imagen
  imagenData: any;
  imagenEstado: boolean = false;

  constructor(
    private canalService: CanalService,
    private obraService: ObraService,
    private spinnerService: Ng4LoadingSpinnerService,
    private completerService: CompleterService,
    private canalObraService: CanalObraService,
    private modalService: BsModalService,
    private sanitization: DomSanitizer
  ) {
  }

  ngOnInit() {
    this.resetVariables(true);

    this.spinnerService.show();

    // inicializamos el autocompleter de canal
    this.dataServiceCanal = this.completerService.remote(this.canalService.urlListarPorNombreOCodigo, 'nombre,codigo', 'nombre');

    // traemos la lista de obras para el auto completer
    this.obraService.listar().subscribe(res => {
      this.dataServiceObra = this.completerService.local(res, 'nombre', 'nombre');
      this.spinnerService.hide();
    }, err => {
      this.estado = 0;
      this.spinnerService.hide();
    });
  }

  onSelectedCanal(selected: CompleterItem) {

    if (selected == null) return;

    this.spinnerService.show();

    this.idCanal = selected.originalObject.id;

    this.canalObraService.buscarIdNombrePorCanalId(this.idCanal).subscribe(res => {

      this.estado = undefined; // borramos los estados anteriores

      // asignamos el resultado a la lista para que sea mostrado en el front
      this.lstCanalObra = res;
      // mostramos la lista de obras y los botones para editar o agregar
      this.seleccionado = true;

      this.spinnerService.hide();

    }, err => {
      this.estado = 0;
      this.spinnerService.hide();
    });
  }

  onSelectedObra(selected: CompleterItem) {

    if (selected == null) {
      this.idObra == 0;
      return;
    }

    this.idObra = selected.originalObject.id;

  }

  onClickAgregar() {
    this.resetVariables(false);
    this.mostrarForm = true;
  }

  editarObra(id: number) {

    this.spinnerService.show();

    // consultamos la informacion del canal obra
    this.canalObraService.buscarPorId(id).subscribe(res => {

      this.canalObra = res;

      // guardamos el id de la obra y el nombre para el autocompleter
      this.idObra = res.obraId.id;
      this.completerObra = res.obraId.nombre;

      this.estado = undefined; // borramos cualquier estado anterior
      // verificamos si tiene imagen guardada
      if (this.canalObra.imagen != null) this.mostrarBotonImagen = true;
      this.mostrarForm = true;
      this.spinnerService.hide();

    }, err => {
      this.estado = 0;
      this.mostrarForm = false;
      this.spinnerService.hide();
    });
  }

  /**
   * se eliminara un canal obra
   * @param id id del canal obra
   * @param index posicion de la lista en donde se encuentra el canal obra
   */
  eliminarObra(id: number, index: number) {

    this.spinnerService.show();

    this.canalObraService.eliminar(id).subscribe(res => {

      // si la respuesta es falsa mostramos el mensaje de error
      if (!res) {
        this.estado = 0;
        this.spinnerService.hide();
        return;
      }

      // eliminamos el elemento del array que fue eliminado 
      this.lstCanalObra.splice(index, 1);
      this.estado = 1;
      this.spinnerService.hide();

    }, err => {
      this.estado = 0;
      this.spinnerService.hide();
    });
  }

  guardar() {

    if (this.idCanal == 0 || this.idObra == 0) {
      this.estado = 0;
      return;
    }

    // creamos el obejto obra y canal para asignarsela al obejto principal para ser pertistido
    let obra = new Obra();
    obra.id = this.idObra;

    let canal = new Canal();
    canal.id = this.idCanal;

    this.canalObra.obraId = obra;
    this.canalObra.canalId = canal;

    this.spinnerService.show();

    let file: File = this.selectedFiles != null ? this.selectedFiles.item(0) : new File(new Array<Blob>(), '');

    this.canalObraService.guardar(this.canalObra, file).subscribe(res => {

      this.estado = res;

      /*
      * si el registro fue exitoso volvemos a consultar la lista de obras del canal
      * para que sea mostrada en el front
      */
      if (res == 1) {
        this.canalObraService.buscarIdNombrePorCanalId(this.idCanal).subscribe(res => {
          this.lstCanalObra = res;
          // borramos el archivo seleccionado
          this.selectedFiles = null;
          this.spinnerService.hide();
        });
      } else {
        this.spinnerService.hide();
      }

      this.mostrarForm = false;

    }, err => {
      this.estado = 0;
      this.spinnerService.hide();
    });



  }

  selectFile(event) {
    this.selectedFiles = event.target.files;
  }

  onClickVer(template: TemplateRef<any>) {

    this.estado = undefined; // borramos estados antaeriores

    this.canalObraService.verImagen(this.canalObra.imagen).subscribe(res => {

      var reader = new FileReader();
      reader.readAsDataURL(res);
      reader.onloadend = () => {
        let x = reader.result;
        this.imagenData = this.sanitization.bypassSecurityTrustResourceUrl(x);
        this.imagenEstado = true;

        this.modalRef = this.modalService.show(template, {
          animated: true,
          keyboard: true,
          backdrop: true,
          ignoreBackdropClick: false,
          class: 'modal-lg'
        });
      }

    }, err => {
      this.estado = 0;
      this.spinnerService.hide();
    });

  }

  /**
   * se reiniciaran las variables 
   * @param todo true si se reinician todas las variables, false si se reinician todas
   *  menos las relacionandas con el canal seleccionado
   */
  resetVariables(todo: boolean) {
    this.mostrarForm = false;
    this.mostrarBotonImagen = false;
    this.canalObra = new CanalObra();
    this.selectedFiles = null;
    this.idObra = 0;
    this.completerObra = '';
    if (todo) {
      this.seleccionado = false;
      this.idCanal = 0;
      this.completerCanal = '';
      this.lstCanalObra = [];
    }
  }

}
