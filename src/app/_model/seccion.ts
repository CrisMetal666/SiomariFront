import { Zona } from "./zona";
import { Canal } from "./canal";

export class Seccion {
    
    id: number;
	nombre: string;
	zonaId: Zona;
	lstCanal: Canal[];
}