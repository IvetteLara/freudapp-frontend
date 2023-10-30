import { GenericService } from './generic.service';
import { UnidadMed } from '../_model/unidadmed';
import { environment } from '../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UnidadMedService extends GenericService<UnidadMed> {

  unidadMedCambio = new Subject<UnidadMed[]>();
  mensajeCambio = new Subject<string>();
  
  //url: string = `${environment.HOST}/unidades`;

  constructor(protected http: HttpClient) {
    super(
      http,
      `${environment.HOST}/unidades`
    );
  }

  listarPageable(p: number, s:number){
    return this.http.get<any>(`${this.url}/pageable?page=${p}&size=${s}`);
  }

  listar() {
    return this.http.get<UnidadMed[]>(this.url);
  }

  listarPorId(id: number) {
    return this.http.get<UnidadMed>(`${this.url}/${id}`);
  }

  registrar(unidadMed: UnidadMed) {
    return this.http.post(this.url, unidadMed);
  }

  modificar(unidadMed: UnidadMed) {
    return this.http.put(this.url, unidadMed);
  }

  eliminar(id: number) {
    return this.http.delete(`${this.url}/${id}`);
  }

}