import { Seccion } from './seccion';
import { Obra } from './obra';

export class Canal {

    id: number;
	codigo: string;
	nombre: string;
	seccionId: Seccion;
	lstObra: Obra[];
}