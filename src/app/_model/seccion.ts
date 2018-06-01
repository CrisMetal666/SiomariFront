import { Zona } from './zona';
import { SeccionCanal } from './seccion-canal'

export class Seccion {
    
    id: number;
	nombre: string;
	zonaId: Zona;
	lstSeccionCanal: SeccionCanal[];
	canalServidor: number;
}