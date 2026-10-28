import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';


// Sin modelo de frontend: usamos 'any' directamente.
// La forma exacta del objeto la define el backend (QuedadasController::formatear).

@Injectable({ 
  providedIn: 'root' 
})
export class QuedadasService {
  private http = inject(HttpClient);
  private api = environment.apiUrl;

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}/quedadas`);
  }

  create(data: any): Observable<any> {
    return this.http.post<any>(`${this.api}/quedadas`, data);
  }

  eliminar(id: number): Observable<any> {
    return this.http.delete(`${this.api}/quedadas/${id}`);
  }

  inscribirse(id: number, info: { nombre_familiar: string; nombre_nino: string; edad_nino: number }): Observable<{ plazas_ocupadas: number }> {
  return this.http.post<{ plazas_ocupadas: number }>(`${this.api}/quedadas/${id}/inscribirse`, info);
}

  cancelarInscripcion(id: number): Observable<{ plazas_ocupadas: number }> {
    return this.http.delete<{ plazas_ocupadas: number }>(`${this.api}/quedadas/${id}/inscribirse`);
  }
  getTipos(): Observable<any[]> {
  return this.http.get<any[]>(`${this.api}/tipos-quedadas`);
  }

  actualizar(id: number, data: any){
    return this.http.put<any>(`${this.api}/quedadas/${id}`, data);
  }

  valorar(id: number, estrellas: number) {
    return this.http.post<any>(`${this.api}/quedadas/${id}/valorar`, { estrellas });
}
}