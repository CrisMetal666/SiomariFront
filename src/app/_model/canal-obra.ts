import { Canal } from './canal';
import { Obra } from './obra';

export class CanalObra {

    id: number;
    descripcion: string;
    longitud: number;
    latitud: number;
	canalId: Canal;
    obraId: Obra;
    
}