import { Seccion } from './seccion';
import { Obra } from './obra';
import { SeccionCanal } from './seccion-canal';
import { Predio } from './predio';

export class Canal {

	id: number;
	codigo: string;
	nombre: string;
	caudalDisenio: string;
	seccionTipica: string;
	clase: string;
	tipo: string;
	categoria: string;
	estado: string;
	longitud: number;
	canalId: Canal;
	lstObra: Obra[];
	lstSeccionCanal: SeccionCanal[];
	lstCanal: Canal[];
	lstPredio: Predio[];
}