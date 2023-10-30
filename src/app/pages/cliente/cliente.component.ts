import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { switchMap } from 'rxjs/operators';
import { Cliente } from '../../_model/cliente';
import { ClienteService } from '../../_service/cliente.service';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css']
})
export class ClienteComponent implements OnInit {

  cantidad: number = 0;
  displayedColumns = ['idCliente', 'numdoc', 'nombres', 'apellidos', 'email', 'acciones'];
  dataSource: MatTableDataSource<Cliente>;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private clienteService: ClienteService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    //Solo cuando se hace next()
    this.clienteService.getClienteCambio().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });

    this.clienteService.getMensajeCambio().subscribe(data => {
      this.snackBar.open(data, 'AVISO', {
        duration: 2000
      });
    })

    this.clienteService.listarPageable(0, 10).subscribe(data => {
      this.cantidad = data.totalElements;
      this.dataSource = new MatTableDataSource(data.content);
      this.dataSource.sort = this.sort;
      //this.dataSource.paginator = this.paginator;
    });
  }

  filtrar(valor: string) {
    this.dataSource.filter = valor.trim().toLowerCase();
  }

  eliminar(idCliente: number) {
    this.clienteService.eliminar(idCliente).pipe(switchMap(() => {
        return this.clienteService.listar();
    })).subscribe(data => {
        this.clienteService.setClienteCambio(data);
        this.clienteService.setMensajeCambio('SE ELIMINÓ');
    });
  }

  mostrarMas(e: any) {
    this.clienteService.listarPageable(e.pageIndex, e.pageSize).subscribe(data => {
      this.cantidad = data.totalElements;
      this.dataSource = new MatTableDataSource(data.content);
      this.dataSource.sort = this.sort;
    });
  }
}
