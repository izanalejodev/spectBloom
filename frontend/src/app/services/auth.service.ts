import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
     return this.http.post(`${this.apiUrl}/login`, { email, password });
  }
  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout`, {}).pipe(
      tap(() => {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user'); 
      })
    );
  }
  register(nombre: string, email: string, password: string, confirmarPassword: string, rol: string): Observable<any> { 
    return this.http.post(`${this.apiUrl}/register`, { nombre, email, password, confirmarPassword, rol }).pipe(
      tap((response: any) => {
        sessionStorage.setItem('token', response.access_token);
        sessionStorage.setItem('user', JSON.stringify(response.user));
      })
    );
  }

  registerConFoto(formData: FormData): Observable<any> {
  return this.http.post(`${this.apiUrl}/register`, formData).pipe(
    tap((response: any) => {
      sessionStorage.setItem('token', response.access_token);
      sessionStorage.setItem('user', JSON.stringify(response.user));
    })
  );
}

  

  getToken(): string | null {
    return sessionStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  isFamiliar(): boolean {
    return this.getUser()?.rol === 'familiar';
  }

  isComun(): boolean {
    return this.getUser()?.rol === 'comun';
  }
  isAdmin(): boolean {
    return this.getUser()?.rol === 'admin';
  }
    getUser(): any {
    const user = sessionStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
  clearSession(): void {
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('user');
}
}