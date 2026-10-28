import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';


@Injectable({ providedIn: 'root' })

export class KidService {
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  getKids() {
    return this.http.get<any[]>(`${this.apiUrl}/kids`);
  }

  crear(kid: any) {
    return this.http.post(`${this.apiUrl}/kids`, kid);
  }
  //posible metodo duplicado
  // getkids() {
  //   return this.http.get<any>(`${this.apiUrl}/kids`)
  // }
  eliminar(id:number){
    return this.http.delete(`${this.apiUrl}/kids/${id}`)
  }
  actualizar(id:number, kid: any){
    return this.http.put(`${this.apiUrl}/kids/${id}`, kid)
  }

}