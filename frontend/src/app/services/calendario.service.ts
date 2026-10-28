import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class CalendarioService {
  
  private apiURL = environment.apiUrl;

  constructor(private http: HttpClient) { }

  //Llamamos a la actividad des de la base de datos
  async obtenerTareas(id: number) {
    const peticion = this.http.get(this.apiURL + '/actividades-hoy/' + id);
    return await firstValueFrom(peticion);
  }

  // Guardar cuando el niño pulsa el checkbox
  async checkTarea(id: number) {
    const peticion = this.http.patch(this.apiURL + '/actividades/' + id + '/completar', {});
    return await firstValueFrom(peticion);
  }

  async obtenerNino(id: number){
    const peticion = this.http.get(this.apiURL + '/nino/' + id);
    return await firstValueFrom(peticion);
  }


}
