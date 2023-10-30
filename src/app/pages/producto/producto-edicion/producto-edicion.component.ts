import { ProductoService } from '../../../_service/producto.service';
import { Producto } from '../../../_model/producto';
import { UnidadMedService } from '../../../_service/unidadmed.service';
import { UnidadMed } from '../../../_model/unidadmed';
import { Component, OnInit, Inject } from '@angular/core';
import { switchMap, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-producto-edicion',
  templateUrl: './producto-edicion.component.html',
  styleUrls: ['./producto-edicion.component.css']
})
export class ProductoEdicionComponent implements OnInit {

  form: FormGroup;
  id: number;
  edicion: boolean;

  unidades: UnidadMed[] = [];
  unidadSeleccionada: UnidadMed;

  //utiles para autocomplete
  myControlUnidad: FormControl = new FormControl();
  unidadesFiltradas: Observable<UnidadMed[]>;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productoService: ProductoService,
    private unidadService: UnidadMedService
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      'idProducto': new FormControl(0),
      'nombre': new FormControl('', [Validators.required, Validators.minLength(3)]),
      'precio': new FormControl(0),
      'unidadMed': this.myControlUnidad
    });

    this.route.params.subscribe((data: Params) => {
      this.id = data['id'];
      this.edicion = data['id'] != null;
      this.initForm();
    });

    this.listarUnidades();
    this.unidadesFiltradas = this.myControlUnidad.valueChanges.pipe(map(val => this.filtrarUnidades(val)));
  }

  get f() { return this.form.controls; }

  initForm() {
    //EDITAR, por lo tanto carga la data a editar
    if (this.edicion) {
      this.productoService.listarPorId(this.id).subscribe(data => {
        this.form = new FormGroup({
          'idProducto': new FormControl(data.idProducto),
          'nombre': new FormControl(data.nombre),
          'precio': new FormControl(data.precio),
          'unidadMed': new FormControl(data.unidadMed)
        });
      });
    }
  }

  filtrarUnidades(val: any) {
    if (val != null && val.idUnidad > 0) {
      return this.unidades.filter(el =>
        el.nombre.toLowerCase().includes(val.nombre.toLowerCase()) 
      );
    }    
    return this.unidades.filter(el =>
      el.nombre.toLowerCase().includes(val?.toLowerCase()) 
    );
  }

  mostrarUnidad(val: UnidadMed) {
    return val ? `${val.nombre}` : val;
  }

  seleccionarUnidad(e: any) {
    this.unidadSeleccionada = e.option.value;
  }

  listarUnidades() {
    this.unidadService.listar().subscribe(data => {
      this.unidades = data;
    });
  }


  operar() {
    if (this.form.invalid) { return; }

    let producto = new Producto();
    producto.idProducto = this.form.value['idProducto'];
    producto.nombre = this.form.value['nombre'];
    producto.precio = this.form.value['precio'];
    producto.unidadMed = this.form.value['unidadMed'];

    if (this.edicion) {
      //MODIFICAR
      this.productoService.modificar(producto).pipe(switchMap(() => {
        return this.productoService.listar();
      })).subscribe(data => {
        this.productoService.setProductoCambio(data);
        this.productoService.setMensajeCambio('SE MODIFICO');
      });

    } else {
      //REGISTRAR
      this.productoService.registrar(producto).pipe(switchMap(() => {
        return this.productoService.listar();
      })).subscribe(data => {
        this.productoService.setProductoCambio(data);
        this.productoService.setMensajeCambio('SE REGISTRO');
      });
    }
    this.router.navigate(['producto']);
  }

}