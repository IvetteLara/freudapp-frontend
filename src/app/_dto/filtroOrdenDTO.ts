export class FiltroOrdenDTO {
    numOrden: string;
    numdoc: string;
    nombreCompleto: string;
    fechaOrden: string;

    constructor(numOrden: string, numdoc: string, nombreCompleto: string, fechaOrden: string) {
        this.numOrden = numOrden;
        this.numdoc = numdoc;
        
        if(nombreCompleto != null) {
            this.nombreCompleto = nombreCompleto.toLowerCase();
        }
        
        this.fechaOrden = fechaOrden;
    }
}