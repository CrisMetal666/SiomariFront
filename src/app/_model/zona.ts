import { Unidad } from "./unidad";
import { Seccion } from "./seccion";

export class Zona {
    
    id: number;
	nombre: string;
	unidadId: Unidad;
	lstSeccion: Seccion[];
	canalServidor: number;
}