import { Canal } from './canal';

export class ManejoAgua {

    id: number;
    fecha: Date;
	qSolicitado: number;
	qExtraido: number;
	qServido: number;
	area: number;
	canalId: Canal;
}