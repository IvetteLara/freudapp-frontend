import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Cliente } from '../../../_model/cliente';
import { ClienteService } from '../../../_service/cliente.service';

@Component({
  selector: 'app-cliente-edicion',
  templateUrl: './cliente-edicion.component.html',
  styleUrls: ['./cliente-edicion.component.css']
})
export class ClienteEdicionComponent implements OnInit {

  form: FormGroup;
  id: number;
  edicion: boolean;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private clienteService: ClienteService
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      'id': new FormControl(0),
      'nombres': new FormControl('', [Validators.required, Validators.minLength(3)]),
      'apellidos': new FormControl('', Validators.required),
      'numdoc': new FormControl(''),
      'telefono': new FormControl(''),
      'email': new FormControl('')
    });

    this.route.params.subscribe((data: Params) => {
      this.id = data['id'];
      this.edicion = data['id'] != null;
      this.initForm();
    });

  }

  get f() { return this.form.controls; }

  initForm() {
    //EDITAR, por lo tanto carga la data a editar
    if (this.edicion) {
      this.clienteService.listarPorId(this.id).subscribe(data => {
        this.form = new FormGroup({
          'idCliente': new FormControl(data.idCliente),
          'nombres': new FormControl(data.nombres),
          'apellidos': new FormControl(data.apellidos),
          'numdoc': new FormControl(data.numdoc),
          'telefono': new FormControl(data.telefono),
          'email': new FormControl(data.email)
        });
      });
    }
  }

  operar() {
    if (this.form.invalid) { return; }

    let cliente = new Cliente();
    cliente.idCliente = this.form.value['idCliente'];
    cliente.nombres = this.form.value['nombres'];
    cliente.apellidos = this.form.value['apellidos'];
    cliente.numdoc = this.form.value['numdoc'];
    cliente.telefono = this.form.value['telefono'];
    cliente.email = this.form.value['email'];

    if (this.edicion) {
      //MODIFICAR
      this.clienteService.modificar(cliente).subscribe(() => {
        this.clienteService.listar().subscribe(data => {
          this.clienteService.setClienteCambio(data);
          this.clienteService.setMensajeCambio('SE MODIFICO');
        });
      });
    } else {
      //INSERTAR
      this.clienteService.registrar(cliente).subscribe(() => {
        this.clienteService.listar().subscribe(data => {
          this.clienteService.setClienteCambio(data);
          this.clienteService.setMensajeCambio('SE REGISTRO');
        });
      });
    }
    this.router.navigate(['cliente']);
  }

}
