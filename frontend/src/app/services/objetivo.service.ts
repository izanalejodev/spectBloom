import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class ObjetivoService {

  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) { }

  crear(objetivo: any){
    return this.http.post(`${this.apiUrl}/objetivos`, objetivo);
  }

  getObjetivos(kidId?: number) {
    const params = kidId ? `?KidID=${kidId}` : '';
    return this.http.get<any>(`${this.apiUrl}/objetivos${params}`);
  }

  eliminar(id:number){
    return this.http.delete(`${this.apiUrl}/objetivos/${id}`);
  }

  actualizar(id:number, objetivo: any){
    return this.http.put(`${this.apiUrl}/objetivos/${id}`, objetivo);
  }

  guardarPictograma(data: { Titulo: string; URL: string }) {
  return this.http.post<any>(`${this.apiUrl}/pictogramas`, data);
  }

  crearTipo(tipoObjetivo: any){
    return this.http.post(`${this.apiUrl}/tipos-objetivos`, tipoObjetivo);
  }

  getTipos() {
    return this.http.get<any>(`${this.apiUrl}/tipos-objetivos`)
  }

  eliminarTipos(id:number){
    return this.http.delete(`${this.apiUrl}/tipos-objetivos/${id}`)
  }

  actualizarTipos(id:number, tipoObjetivo: any){
    return this.http.put(`${this.apiUrl}/tipos-objetivos/${id}`, tipoObjetivo)
  }

  updateMarcas(id: number, marcas: boolean[][]): Observable<any> {
    return this.http.patch(`${this.apiUrl}/objetivos/${id}/marcas`, { Marcas: marcas });
}
}
