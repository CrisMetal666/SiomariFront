import { Canal } from "./canal";

export class Predio {
    
    id: number;
	codigo: string;
	nombre: string;
	nombrePropietario: string;
	nombreUsuario: string;
	areaTotal: number;
	areaPotencialRiego: number;
	areaBajoRiego: number;
	moduloRiego: number;
	numeroTomas: number;
	tipoSuelo: string;
	x: number;
	y: number;
	altitud: number;
	canalId: Canal;
}