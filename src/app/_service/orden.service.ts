import { GenericService } from './generic.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Orden } from '../_model/orden';
import { FiltroOrdenDTO } from '../_dto/filtroOrdenDTO';

@Injectable({
  providedIn: 'root'
})
export class OrdenService extends GenericService<Orden> {

  private ordenCambio = new Subject<Orden[]>();
  private mensajeCambio = new Subject<string>();

  constructor(protected http: HttpClient) {
    super(
      http,
      `${environment.HOST}/ordenes`
    )
  }
  
  //get Subjects
  getOrdenCambio() {
    return this.ordenCambio.asObservable();
  }

  getMensajeCambio() {
    return this.mensajeCambio.asObservable();
  }

  //set Subjects
  setOrdenCambio(ordens: Orden[]) {
    this.ordenCambio.next(ordens);
  }

  setMensajeCambio(mensaje: string) {
    this.mensajeCambio.next(mensaje);
  }
  
  listarPageable(p: number, s:number){
    return this.http.get<any>(`${this.url}/pageable?page=${p}&size=${s}`);
  }

  listar() {
    return this.http.get<Orden[]>(this.url);
  }

  listarPorId(id: number) {
    return this.http.get<Orden>(`${this.url}/${id}`);
  }

  registrar(orden: Orden) {
    return this.http.post(this.url, orden);
  }

  modificar(orden: Orden) {
    return this.http.put(this.url, orden);
  }

  eliminar(id: number) {
    return this.http.delete(`${this.url}/${id}`);
  }

 
  buscar(filtroOrden : FiltroOrdenDTO){
    return this.http.post<Orden[]>(`${this.url}/buscar`, filtroOrden);
  }


}
