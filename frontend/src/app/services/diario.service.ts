import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';


@Injectable({ providedIn: 'root' })
export class DiarioService {
  private http = inject(HttpClient);
  private api  = environment.apiUrl;

  getEntradas(kidId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}/diario/${kidId}`);
  }

  crear(data: any): Observable<any> {
    return this.http.post<any>(`${this.api}/diario`, data);
  }

  actualizar(id: number, data: any): Observable<any> {
    return this.http.put<any>(`${this.api}/diario/${id}`, data);
  }

  eliminar(id: number): Observable<any> {
    return this.http.delete(`${this.api}/diario/${id}`);
  }
}