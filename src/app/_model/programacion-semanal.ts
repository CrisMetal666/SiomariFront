import { Canal } from "./canal";

export class ProgramacionSemanal {

	id: number;
	lamina: number;
	area: number;
	fecha: Date;
	eficiencia: number;
	caudal: number;
	canalId: Canal;
	capacidadCanal: number;
}