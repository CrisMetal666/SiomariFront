import { Predio } from "./predio";

export class Usuario {
    
    id: number;
	cedula: string;
	nombre: string;
	apellido: string;
	direccion: string;
	ciudad: string;
	telefono: string;
	celular: string;
	correo: string;
	propietario: boolean;
	predioId: Predio;
	nombreCompleto: string;
}