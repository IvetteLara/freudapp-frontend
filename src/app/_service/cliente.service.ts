import { GenericService } from './generic.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Cliente } from '../_model/cliente';

@Injectable({
  providedIn: 'root'
})
export class ClienteService extends GenericService<Cliente> {

  private clienteCambio = new Subject<Cliente[]>();
  private mensajeCambio = new Subject<string>();
  
  constructor(protected http: HttpClient) {
    super(
      http,
      `${environment.HOST}/clientes`
    );
  }

  //get Subjects
  getClienteCambio() {
    return this.clienteCambio.asObservable();
  }

  getMensajeCambio() {
    return this.mensajeCambio.asObservable();
  }

  //set Subjects
  setClienteCambio(clientes: Cliente[]) {
    this.clienteCambio.next(clientes);
  }

  setMensajeCambio(mensaje: string) {
    this.mensajeCambio.next(mensaje);
  }
  
  listarPageable(p: number, s:number){
    return this.http.get<any>(`${this.url}/pageable?page=${p}&size=${s}`);
  }

  listar() {
    return this.http.get<Cliente[]>(this.url);
  }

  listarPorId(id: number) {
    return this.http.get<Cliente>(`${this.url}/${id}`);
  }

  registrar(cliente: Cliente) {
    return this.http.post(this.url, cliente);
  }

  modificar(cliente: Cliente) {
    return this.http.put(this.url, cliente);
  }

  eliminar(id: number) {
    return this.http.delete(`${this.url}/${id}`);
  }

}