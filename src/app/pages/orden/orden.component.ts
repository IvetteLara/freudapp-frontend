import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { switchMap } from 'rxjs/operators';
import { Observable, EMPTY } from 'rxjs';
import * as moment from 'moment';
import { Orden } from '../../_model/orden';
import { OrdenDetalle } from '../../_model/ordenDetalle';
import { Producto } from '../../_model/producto';
import { Cliente } from '../../_model/cliente';
import { OrdenService } from '../../_service/orden.service';
import { ProductoService } from '../../_service/producto.service';
import { ClienteService } from '../../_service/cliente.service';

@Component({
  selector: 'app-orden',
  templateUrl: './orden.component.html',
  styleUrls: ['./orden.component.css']
})
export class OrdenComponent implements OnInit {

  cantidad: number = 0;
  displayedColumns = ['idOrden','numOrden', 'cliente', 'fecha', 'monto', 'acciones'];
  dataSource: MatTableDataSource<Orden>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private ordenService: OrdenService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {

    this.ordenService.getOrdenCambio().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });

    this.ordenService.getMensajeCambio().subscribe(data => {
      this.snackBar.open(data, 'AVISO', { duration: 2000 });
    });

    this.ordenService.listarPageable(0,10).subscribe(data => {
      this.cantidad = data.totalElements;
      this.dataSource = new MatTableDataSource(data.content);
      this.dataSource.sort = this.sort;
      //this.dataSource.paginator = this.paginator;
    });
  }

  filtrar(valor: string) {
    this.dataSource.filter = valor.trim().toLowerCase();
  }

  eliminar(idOrden: number) {
    this.ordenService.eliminar(idOrden).pipe(switchMap(() => {
      return this.ordenService.listar();
    })).subscribe(data => {
      this.ordenService.setOrdenCambio(data);
      this.ordenService.setMensajeCambio('SE ELIMINO');
    });
  }

  mostrarMas(e: any) {
    this.ordenService.listarPageable(e.pageIndex, e.pageSize).subscribe(data => {
      this.cantidad = data.totalElements;
      this.dataSource = new MatTableDataSource(data.content);
      this.dataSource.sort = this.sort;
    });
  }

}
