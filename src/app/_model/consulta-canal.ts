import { Predio } from "./predio";
import { EstructuraControl } from "./estructura-control";
import { ObraDetalle } from "./obra-detalle";

export class ConsultaCanal {

    id: number;
	codigo: string;
	nombre: string;
	caudalDisenio: number;
	longitud: number;
	areaServida: number;
	seccionTipica: string;
	clase: string;
	tipo: string;
	categoria: string;
	estado: string;
	estadoDescripcion: string;
	canalServidor: string;
	sumPredios: number;
	lstObraDetalle: ObraDetalle[];
	lstCanal: string[];
	lstPredio: Predio[];
    lstEstructuraControl: EstructuraControl[];
    
}