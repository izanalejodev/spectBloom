import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ActividadService {

  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) { }

  crear(actividad: any){
    return this.http.post(`${this.apiUrl}/actividades`, actividad);
  }
  crearTipo(tipoActividad: any){
    return this.http.post(`${this.apiUrl}/tipos-actividades`, tipoActividad);
  }
  getTipos() {
    return this.http.get<any>(`${this.apiUrl}/tipos-actividades`)
  }

  getActividades(kidId?: number) {
  const params = kidId ? `?kidId=${kidId}` : '';
  return this.http.get<any>(`${this.apiUrl}/actividades${params}`);
}
  eliminar(id:number){
    return this.http.delete(`${this.apiUrl}/tipos-actividades/${id}`)
  }
  actualizar(id:number, tipoActividad: any){
    return this.http.put(`${this.apiUrl}/tipos-actividades/${id}`, tipoActividad)
  }
  eliminarAct(id:number){
    return this.http.delete(`${this.apiUrl}/actividades/${id}`)
  }
  actualizarAct(id:number, Actividad: any){
    return this.http.put(`${this.apiUrl}/actividades/${id}`, Actividad)
  }

  guardarPictograma(data: { Titulo: string; URL: string }) {
  return this.http.post<any>(`${this.apiUrl}/pictogramas`, data);
}
}
