import { Canal } from './canal';
import { Obra } from './obra';

export class CanalObra {

    id: number;
    descripcion: string;
    x: number;
	y: number;
	altitud: number;
	canalId: Canal;
    obraId: Obra;
    
}