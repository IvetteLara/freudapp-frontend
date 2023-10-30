import { OrdenDetalle } from './ordenDetalle';
import { Cliente } from './cliente';

export class Orden {
    idOrden: number;
    cliente: Cliente;
    fecha: string;
    numOrden: string;
    monto: number;
    descripcion: string;
    detalleOrden: OrdenDetalle[];
}