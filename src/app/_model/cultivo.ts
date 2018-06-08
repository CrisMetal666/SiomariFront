import { PlanSiembra } from './plan-siembra';
import { Kc } from './kc';

export class Cultivo {

    id: number;
	nombre: string;
	lstKc: Kc[];
    lstPlanSiembra: PlanSiembra[];
    
}