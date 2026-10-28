import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NeuroService } from '../../services/neuro.service';
import { CommonModule } from '@angular/common';

// Definimos la estructura para evitar errores de tipo
interface WikipediaDefs {
  tea: string | null;
  tdah: string | null;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  // Inicialización de variables
  definiciones: WikipediaDefs = { 
    tea: null, 
    tdah: null 
  };
  
  userName: string = '';
  rol: string = '';
  articulos: any[] = [];
  cargando = true;
  error = false;

 constructor(
    public authService: AuthService, 
    private neuroService: NeuroService, 
    private cdr: ChangeDetectorRef
  ) {
    const user = this.authService.getUser();
    
    const nombreCompleto = user?.nombre || '';
    this.userName = nombreCompleto.trim().split(' ')[0];
    
    this.rol = user?.rol || '';
  }

}