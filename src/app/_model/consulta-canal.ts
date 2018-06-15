import { CanalObra } from "./canal-obra";
import { Canal } from "./canal";
import { Predio } from "./predio";
import { EstructuraControl } from "./estructura-control";

export class ConsultaCanal {

    id: number;
	codigo: string;
	nombre: string;
	caudalDisenio: number;
	longitud: number;
	seccionTipica: string;
	clase: string;
	tipo: string;
	categoria: string;
	estado: string;
	estadoDescripcion: string;
	canalServidor: string;
	sumPredios: number;
	lstCanalObra: CanalObra[];
	lstCanal: string[];
	lstPredio: Predio[];
    lstEstructuraControl: EstructuraControl[];
    
}