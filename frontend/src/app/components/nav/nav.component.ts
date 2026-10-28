import { Component, HostListener, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { AiChatComponent } from '../ai-chat/ai-chat.component';
import { KidService } from '../../services/kid.service';

@Component({
  selector: 'app-nav',
  imports: [RouterLink, CommonModule, AiChatComponent, ReactiveFormsModule],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent implements OnInit {

  constructor(public authService: AuthService, private router: Router, private KidService: KidService,) { const user = this.authService.getUser(); this.rol = user?.rol || ''; }

  //------------------------
  //Declaración de variables
  //------------------------
  mobileMenuOpen = false;
  chatAbierto = false;
  dropdownOpen = false;
  rol: string = '';

  //------------------------ 
  //Modales kids
  //------------------------ 
  modalKid = false;
  modalGestionKid = false;
  modalEditarKid = false;

  kids: any[] = [];
  kidSeleccionado: any = null;
  kidActivo: any = null;


  //------------------------ 
  //Formularios
  //------------------------ 

  formKid = new FormGroup({
    Nombre: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-ZÁÉÍÓÚáéíóúñÑ0-9\s,.# -]+$/)]),
    Apellidos: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-ZÁÉÍÓÚáéíóúñÑ0-9\s,.# -]+$/)]),
    Fecha_nacimiento: new FormControl('', [Validators.required, Validators.pattern(/^(200[0-9]|201[0-9]|202[0-6])-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/)])
  });
  formUpdateKid = new FormGroup({
    Nombre: new FormControl('', Validators.required),
    Apellidos: new FormControl('', Validators.required),
    Fecha_nacimiento: new FormControl('', Validators.required)
  });



  ngOnInit(): void {
    this.cargarKids();
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  toggleChat() {
    this.chatAbierto = !this.chatAbierto;
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }



  logout() {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/inicioSesion']);
      }
    });
  }

  //----------------------------
  //Funciones para abrir modales 
  //----------------------------
  abrirAnadirKid(): void {
    this.modalGestionKid = false;
    this.modalKid = true;
  }
  abrirEditarKid(kid: any) {
    this.kidSeleccionado = kid;
    this.formUpdateKid.patchValue({
      Nombre: kid.Nombre,
      Apellidos: kid.Apellidos,
      Fecha_nacimiento: kid.Fecha_nacimiento
    })
    this.abrirModalEditarKid();
  }
  abrirModalEditarKid(): void {
    this.modalGestionKid = false;
    this.modalEditarKid = true;
  }

  anyadirKid(): void {
    if (this.formKid.valid) {
      this.KidService.crear(this.formKid.value).subscribe({
        next: (kid) => {
          this.kids = [...this.kids, kid];
          this.kidActivo = kid;
          this.modalKid = false;
          this.formKid.reset();
          window.location.reload();
        },
        error: (err) => console.error('Error:', err)
      });
    }
  }

  eliminarKid(id: number) {
    if (!confirm(`¿Eliminar infante"?`)) return;
    this.KidService.eliminar(id).subscribe(() => {


      this.kids = this.kids.filter(k => k.KidID !== id);
      if (this.kidActivo?.KidID === id) {
        this.kidActivo = this.kids.length > 0 ? this.kids[0] : null;
      }
      this.modalGestionKid = false;
      window.location.reload();

    });
  }

  actualizarKid() {
    this.KidService.actualizar(this.kidSeleccionado.KidID, this.formUpdateKid.value).subscribe({
      next: () => {
        this.modalEditarKid = false;
        this.cargarKids();
        this.formUpdateKid.reset();
        window.location.reload();
      },
      error: (err) => console.error('Error:', err)
    });
  }
  cargarKids(): void {
    this.KidService.getKids().subscribe((datos: any) => {
      this.kids = datos;
    });
  }

  calcularEdad(fechaNacimiento: string): number {
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    return edad;
  }
}