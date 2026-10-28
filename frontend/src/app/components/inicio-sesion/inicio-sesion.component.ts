import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { environment }        from '../../../environments/environment';
import { HttpClient }         from '@angular/common/http';

declare const google: any;
@Component({
  selector: 'app-inicio-sesion',
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './inicio-sesion.component.html',
  styleUrl: './inicio-sesion.component.css'
})
export class InicioSesionComponent {
  error: string = '';
  errorEmail: string = '';
  loading: boolean = false;
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private http: HttpClient

  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }
  ngOnInit(): void {
    // Espera a que el script de Google cargue
    window.onload = () => this.initGoogle();
    // Por si el script ya había cargado antes
    if (typeof google !== 'undefined') this.initGoogle();
  }

  onSubmit() {
    this.error = '';

    const email = this.loginForm.get('email')?.value;
    const password = this.loginForm.get('password')?.value;


    // Validar email
    if (this.loginForm.get('email')?.errors?.['required']) {
      this.error = 'El emailes obligatorio';
      return;
    }
    if (this.loginForm.get('email')?.errors?.['email']) {
      this.error = 'Error: El email no es correcto';
      return;
    }

    // Validar contraseña
    if (!password || password.length === 0) {
      this.error = 'La contraseña es obligatoria';
      return;
    }
    if (password.length < 5 || password.length > 16) {
      this.error = 'Error: La contraseña tiene que tener entre 5 a 16 caracteres';
      return;
    }
    const passwordValida = /^[a-zA-Z0-9]+$/.test(password);
    if (!passwordValida) {
      this.error = 'Error: La contraseña no es correcta';
      return;
    }

    this.loading = true;

    this.authService.login(email!, password!).subscribe({
      next: (res: any) => {
        this.loading = false;
        // Guardar token aquí, solo si el login fue exitoso
        sessionStorage.setItem('token', res.access_token);
        sessionStorage.setItem('user', JSON.stringify(res.user));
        this.router.navigate(['/home']);
    },
      error: (err) => {
        this.loading = false;
        if (err.status === 404) {
          this.error = 'Error: El usuario no existe';
        } else if (err.status === 401) {
          this.error = 'Credenciales incorrectas';
        } else {
          this.error = err.error?.message || 'Error al iniciar sesión';
        }
      }
    });
  }
  initGoogle(): void {
      google.accounts.id.initialize({
        client_id: '459295645564-7l259g9rc0qugd066sb7rtvdjsqcr80i.apps.googleusercontent.com', 
        callback: (response: any) => this.handleGoogleResponse(response)
      });
  
      google.accounts.id.renderButton(
        document.getElementById('googleBtn'),
        {
          theme:  'outline',
          size:   'large',
          width:  '100%',
          text:   'continue_with',
          locale: 'es'
        }
      );
    }
  
    handleGoogleResponse(response: any): void {
      // response.credential = token que manda Google
      this.http.post(`${environment.apiUrl}/auth/google`, {
        token: response.credential
      }).subscribe({
        next: (res: any) => {
          sessionStorage.setItem('token', res.access_token);
          sessionStorage.setItem('user',  JSON.stringify(res.user));
          this.router.navigate(['/home']);
        },
        error: (err) => console.error('Error Google login:', err)
      });
    }
}