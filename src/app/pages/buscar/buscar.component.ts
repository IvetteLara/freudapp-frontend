import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { EMPTY } from 'rxjs';
import * as moment from 'moment';
import { BuscarDialogoComponent } from './buscar-dialogo/buscar-dialogo.component';
import { Orden } from './../../_model/orden';
import { OrdenService } from './../../_service/orden.service';
import { FiltroOrdenDTO } from '../../_dto/filtroOrdenDTO';

@Component({
  selector: 'app-buscar',
  templateUrl: './buscar.component.html',
  styleUrls: ['./buscar.component.css']
})
export class BuscarComponent implements OnInit {

  form: FormGroup;
  maxFecha: Date = new Date();
 
  displayedColumns = ['idOrden', 'cliente', 'numOrden', 'fecha', 'monto', 'acciones'];
  dataSource: MatTableDataSource<Orden>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private ordenService: OrdenService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      'numOrden': new FormControl(''),
      'numdoc': new FormControl(''),
      'nombreCompleto': new FormControl(''),
      'fechaOrden': new FormControl()
    });
  }

  buscar() {
    let filtro = new FiltroOrdenDTO(this.form.value['numOrden'], this.form.value['numdoc'], this.form.value['nombreCompleto'], moment(this.form.value['fechaOrden']).format('YYYY-MM-DDTHH:mm:ss'));

    if (filtro.fechaOrden != 'Invalid date') {
      delete filtro.numOrden;
      delete filtro.numdoc;
      delete filtro.nombreCompleto;
    } else {
      filtro.fechaOrden = null;
      delete filtro.fechaOrden;

      if (filtro.numOrden.length === 0) {
        delete filtro.numOrden;
      }

      if (filtro.numdoc.length === 0) {
        delete filtro.numdoc;
      }

      if (filtro.nombreCompleto.length === 0) {
        delete filtro.nombreCompleto
      }
    }

    this.ordenService.buscar(filtro).subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  verDetalle(orden: Orden) {
    this.dialog.open(BuscarDialogoComponent, {
      data: orden
    });
  }
}
