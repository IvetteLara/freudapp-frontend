import { GenericService } from './generic.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Producto } from '../_model/producto';

@Injectable({
  providedIn: 'root'
})
export class ProductoService extends GenericService<Producto> {

  private productoCambio = new Subject<Producto[]>();
  private mensajeCambio = new Subject<string>();

  constructor(protected http: HttpClient) {
    super(
      http,
      `${environment.HOST}/productos`
    );
  }

  //get Subjects
  getProductoCambio() {
    return this.productoCambio.asObservable();
  }

  getMensajeCambio() {
    return this.mensajeCambio.asObservable();
  }

  //set Subjects
  setProductoCambio(productos: Producto[]) {
    this.productoCambio.next(productos);
  }

  setMensajeCambio(mensaje: string) {
    this.mensajeCambio.next(mensaje);
  }

  listarPageable(p: number, s:number){
    return this.http.get<any>(`${this.url}/pageable?page=${p}&size=${s}`);
  }

  listar() {
    return this.http.get<Producto[]>(this.url);
  }

  listarPorId(id: number) {
    return this.http.get<Producto>(`${this.url}/${id}`);
  }

  registrar(producto: Producto) {
    return this.http.post(this.url, producto);
  }

  modificar(producto: Producto) {
    return this.http.put(this.url, producto);
  }

  eliminar(id: number) {
    return this.http.delete(`${this.url}/${id}`);
  }
  
}
