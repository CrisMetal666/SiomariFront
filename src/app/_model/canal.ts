import { Seccion } from './seccion';
import { CanalObra } from './canal-obra';
import { SeccionCanal } from './seccion-canal';
import { Predio } from './predio';

export class Canal {

	id: number;
	codigo: string;
	nombre: string;
	caudalDisenio: number;
	seccionTipica: string;
	clase: string;
	tipo: string;
	categoria: string;
	estado: string;
	estadoDescripcion: string;
	longitud: number;
	canalId: Canal;
	lstCanalObra: CanalObra[];
	lstSeccionCanal: SeccionCanal[];
	lstCanal: Canal[];
	lstPredio: Predio[];
}