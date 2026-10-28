import { Component } from '@angular/core';
import { RouterLink } from "@angular/router";
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { environment }        from '../../../environments/environment';
import { HttpClient }         from '@angular/common/http';


declare const google: any;

@Component({
  selector: 'app-registro',
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent {
  registerForm: FormGroup;
  error = '';
  loading = false;
  fotoSeleccionada: File | null = null;
  fotoPreview: string | null = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private http: HttpClient
  ) {
    this.registerForm = this.fb.group({
      tipo: ['familiar', Validators.required],
      nombre: ['', [Validators.required, Validators.minLength(2), Validators.pattern('^[a-zA-ZÁÉÍÓÚáéíóúñÑ ]+$')]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(16),  Validators.pattern(/^[^@]+$/)]],
      confirmarPassword: ['', Validators.required]
    }, {
      validators: this.passwordMatchValidator
    });
  }
   ngOnInit(): void {
    // Espera a que el script de Google cargue
    window.onload = () => this.initGoogle();
    // Por si el script ya había cargado antes
    if (typeof google !== 'undefined') this.initGoogle();
  }

  passwordMatchValidator(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmarPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  onFotoSeleccionada(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.fotoSeleccionada = file;
      const reader = new FileReader();
      reader.onload = (e: any) => this.fotoPreview = e.target.result;
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      this.error = 'Por favor completa todos los campos correctamente';
      return;
    }

    this.loading = true;
    this.error = '';

    const { nombre, email, password, confirmarPassword, tipo } = this.registerForm.value;

    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('confirmarPassword', confirmarPassword);
    formData.append('rol', tipo);
    if (this.fotoSeleccionada) {
      formData.append('fotoPerfil', this.fotoSeleccionada);  // FIX: minúscula, igual que la BD y el controller
    }

    this.authService.registerConFoto(formData).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error.message || 'Error al registrarse';
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