import { Component, OnInit, Inject } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Orden } from './../../../_model/orden';
import { OrdenDetalle } from './../../../_model/ordenDetalle';
import { OrdenService } from './../../../_service/orden.service';

@Component({
  selector: 'app-buscar-dialogo',
  templateUrl: './buscar-dialogo.component.html',
  styleUrls: ['./buscar-dialogo.component.css']
})
export class BuscarDialogoComponent implements OnInit {

  orden: Orden;
  displayedColumns = ['producto', 'cantidad', 'precio', 'total'];
  dataSource: MatTableDataSource<OrdenDetalle>;
 
  constructor(
    private ordenService : OrdenService,
    private dialogRef: MatDialogRef<BuscarDialogoComponent>,
    @Inject(MAT_DIALOG_DATA) private data: Orden
  ) { }

  ngOnInit(): void {
    this.orden = this.data;
    this.dataSource = new MatTableDataSource(this.data.detalleOrden);
    }

  cancelar(){
    this.dialogRef.close();
  }
 
}
