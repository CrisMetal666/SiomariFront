import { Predio } from './predio';
import { Cultivo } from './cultivo';
import { PlanSiembra } from './plan-siembra';

export class CultivoPredio {

    id: number;
	hectareas: number;
	predioId: Predio;
	cultivoId: Cultivo;
	planSiembraId: PlanSiembra;
	idsEliminar: number[];
}