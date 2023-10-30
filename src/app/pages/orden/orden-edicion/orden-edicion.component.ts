import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable, EMPTY } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';
import { Orden } from '../../../_model/orden';
import { OrdenDetalle } from '../../../_model/ordenDetalle';
import { Producto } from '../../../_model/producto';
import { Cliente } from '../../../_model/cliente';
import { OrdenService } from '../../../_service/orden.service';
import { ProductoService } from '../../../_service/producto.service';
import { ClienteService } from '../../../_service/cliente.service';

@Component({
  selector: 'app-orden-edicion',
  templateUrl: './orden-edicion.component.html',
  styleUrls: ['./orden-edicion.component.css']
})
export class OrdenEdicionComponent implements OnInit {

  form: FormGroup;
  id: number;
  edicion: boolean;

  clientes: Cliente[] = [];
  productos: Producto[] = [];

  monto: number;
  detalleOrden: OrdenDetalle[] = [];

  cantidad: number;
  precio: number;
  mensaje: string;

  clienteSeleccionado: Cliente;
  productoSeleccionado: Producto;
 
  fechaSeleccionada: Date = new Date();
  maxFecha: Date = new Date();

  //utiles para autocomplete
  myControlCliente: FormControl = new FormControl();
  myControlProducto: FormControl = new FormControl();

  clientesFiltrados: Observable<Cliente[]>;
  productosFiltrados: Observable<Producto[]>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private clienteService: ClienteService,
    private productoService: ProductoService,
    private ordenService: OrdenService
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      'idOrden': new FormControl(0),
      'numOrden': new FormControl(''),
      'cliente': this.myControlCliente,
      'monto': new FormControl(0),
      'fecha': new FormControl(new Date()),
      'descripcion': new FormControl(''),
      'producto': this.myControlProducto,
      'cantidad': new FormControl(0),
      'precio': new FormControl(0),
    });

    this.route.params.subscribe((data: Params) => {
      this.id = data['id'];
      this.edicion = data['id'] != null;
      this.initForm();
    });

    this.refresh();
  }

  refresh() {
    this.listarClientes();
    this.listarProductos();
 
    this.clientesFiltrados = this.myControlCliente.valueChanges.pipe(map(val => this.filtrarClientes(val)));
    this.productosFiltrados = this.myControlProducto.valueChanges.pipe(map(val => this.filtrarProductos(val)));
  }

  get f() { return this.form.controls; }

  initForm() {
    //EDITAR, por lo tanto carga la data a editar
    if (this.edicion) {
      this.ordenService.listarPorId(this.id).subscribe(data => {
        this.form = new FormGroup({
          'idOrden': new FormControl(data.idOrden),
          'numOrden': new FormControl(data.numOrden),
          'cliente': new FormControl(data.cliente),
          'monto': new FormControl(data.monto),
          'fecha': new FormControl(data.fecha),
          'descripcion': new FormControl(data.descripcion),
          'producto': this.myControlProducto,
          'cantidad': new FormControl(0),
          'precio': new FormControl(0),
         });
         this.detalleOrden = data.detalleOrden;
         this.refresh();
        });
    }
  }

  filtrarClientes(val: any) {
    if (val != null && val.idCliente > 0) {
      return this.clientes.filter(el =>
        el.nombres.toLowerCase().includes(val.nombres.toLowerCase()) || el.apellidos.toLowerCase().includes(val.apellidos.toLowerCase()) || el.numdoc.includes(val.dni)
      );
    }    
    return this.clientes.filter(el =>
      el.nombres.toLowerCase().includes(val?.toLowerCase()) || el.apellidos.toLowerCase().includes(val?.toLowerCase()) || el.numdoc.includes(val)
    );
  }


  filtrarProductos(val: any) {
    if (val != null && val.idProducto > 0) {
      return this.productos.filter(option =>
        option.nombre.toLowerCase().includes(val.nombres.toLowerCase()));
    } else {
      return this.productos.filter(option =>
        option.nombre.toLowerCase().includes(val?.toLowerCase()));
    }
  }

  cambieFecha(e: any) {
    console.log(e);
  }

  mostrarCliente(val: Cliente) {
    return val ? `${val.nombres} ${val.apellidos}` : val;
  }

  mostrarProducto(val: Producto) {
    return val ? `${val.nombre}` : val;
  }

  seleccionarCliente(e: any) {
    this.clienteSeleccionado = e.option.value;
  }

  seleccionarProducto(e: any) {
    this.productoSeleccionado = e.option.value;
    this.precio = this.productoSeleccionado.precio;
  }

  listarClientes() {
    this.clienteService.listar().subscribe(data => {
      this.clientes = data;
    });
  }

  listarProductos() {
    this.productoService.listar().subscribe(data => {
      this.productos = data;
    })
  }

  agregar() {

    if (this.productoSeleccionado != null && this.cantidad != null) {
      let det = new OrdenDetalle();
      det.producto = this.form.value['producto']; //this.productoSeleccionado;
      det.cantidad = this.cantidad;
      det.precio = this.precio;
      this.detalleOrden.push(det);
      this.calculate();
      this.productoSeleccionado = null; 
      this.cantidad = 0;
      this.precio = 0;
  
    } else {
      this.mensaje = `Debe agregar los datos del producto`;
      this.ordenService.setMensajeCambio(this.mensaje);
    }
  }

  removerProducto(index: number) {
    this.detalleOrden.splice(index, 1);
    this.calculate();
  }


  estadoBotonRegistrar() {
    return (this.detalleOrden.length === 0 || this.clienteSeleccionado === null || this.form.invalid);
  }

  calculate() {
    this.monto =
    this.detalleOrden.map(item => item.cantidad * item.precio).reduce((prev, curr) => prev + curr, 0);
    console.log(this.monto);
  }

  operar() {
    let orden = new Orden();
    orden.idOrden = this.form.value['idOrden']; 
    orden.cliente = this.form.value['cliente']; //this.clienteSeleccionado;
    orden.numOrden = this.form.value['numOrden'];
    orden.monto = this.form.value['monto'];
    orden.descripcion = this.form.value['descripcion'];
    orden.fecha = moment(this.form.value['fecha']).format('YYYY-MM-DDTHH:mm:ss');
    orden.detalleOrden = this.detalleOrden;

    if (this.edicion) {
      //MODIFICAR
      this.ordenService.modificar(orden).subscribe(() => {
        this.ordenService.listar().subscribe(data => {
          this.ordenService.setOrdenCambio(data);
          this.ordenService.setMensajeCambio('SE MODIFICO');
        });
      });
    } else {
      //INSERTAR
      this.ordenService.registrar(orden).subscribe(() => {
        this.ordenService.listar().subscribe(data => {
          this.ordenService.setOrdenCambio(data);
          this.ordenService.setMensajeCambio('SE REGISTRO');
        });
      });
    }
    this.limpiarControles();
    this.router.navigate(['orden']);
  }
  
  limpiarControles() {
    this.detalleOrden = [];
    this.clienteSeleccionado = null;
    this.productoSeleccionado = null;
    this.precio = 0;
    this.cantidad = 0;
    //this.clientesFiltrados = EMPTY;
    //this.productosFiltrados = EMPTY;
    this.fechaSeleccionada = new Date();
    this.fechaSeleccionada.setHours(0);
    this.fechaSeleccionada.setMinutes(0);
    this.fechaSeleccionada.setSeconds(0);
    this.fechaSeleccionada.setMilliseconds(0);
    this.mensaje = '';    
    
    this.myControlCliente.reset();
    this.myControlProducto.reset();
    
    this.form.value['numOrden'] = null;
    this.form.value['description'] = null;
  }
}
