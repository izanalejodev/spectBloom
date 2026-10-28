import { CommonModule } from '@angular/common';
import { Component, OnInit, NgZone, ViewChild } from '@angular/core';
import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ObjetivoService } from '../../services/objetivo.service';
import { KidService } from '../../services/kid.service';
import { FormsModule } from '@angular/forms';
import { ViewEncapsulation as VE } from '@angular/core';

@Component({
  selector: 'app-economia-fichas',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, FullCalendarModule],
  templateUrl: './economia-fichas.component.html',
  styleUrl: './economia-fichas.component.css',
  encapsulation: VE.None
})
export class EconomiaFichasComponent implements OnInit {

  constructor(
    private ObjeService: ObjetivoService,
    private kidService: KidService,
    private ngZone: NgZone
  ) { }

  //---------------
  // Variables Niño
  //---------------
  kidActivo: any = null;
  kids: any[] = [];

  //---------------------------
  // Objetivo activo (solo uno)
  //---------------------------

  objetivo: any = null;

  //---------
  // Modales
  //---------
  modalSeleccionTipo = false;
  modalRecomendacionesTEA = false;
  modalRecomendacionesTDAH = false;
  modalAddObjetivo = false;
  modalTipo = false;
  modalAddTipo = false;
  modalEditTipo = false;

  //--------------------
  // Perfil seleccionado
  //--------------------
  perfilSeleccionado: 'TEA' | 'TDAH' | null = null;

  //---------
  // Tipos
  //---------
  tiposObjetivo: any[] = [];
  tipoSeleccionado: any = null;

  //-----------------------
  // Pictograma de objetivo
  //-----------------------
  busquedaPictograma = '';
  resultadosPictograma: any[] = [];
  cargandoPictograma = false;
  pictogramaSeleccionado: { PictoID: number; Titulo: string; URL: string } | null = null;

  //-------------------------
  // Pictograma de recompensa
  //-------------------------
  busquedaPictogramaRecompensa = '';
  resultadosPictogramaRecompensa: any[] = [];
  cargandoPictogramaRecompensa = false;
  pictogramaRecompensaSeleccionado: { PictoID: number; Titulo: string; URL: string } | null = null;

  //-------------------------
  // Calendario
  //-------------------------
  dias = ['LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES'];
  marcas: boolean[][] = Array.from({ length: 4 }, () => Array(5).fill(false));

  toggleEstrella(fila: number, col: number): void {
    this.marcas[fila][col] = !this.marcas[fila][col];
    this.ObjeService.updateMarcas(this.objetivo.ObjetivoID, this.marcas).subscribe();

  }

  //------------
  // Formularios
  //------------
  formObjetivo = new FormGroup({
    Titulo: new FormControl('', [Validators.required,
    Validators.minLength(5),
    Validators.maxLength(30),
    Validators.pattern(/^[a-zA-ZÁÉÍÓÚáéíóúñÑ\s]+$/)
    ]),
    Descripcion: new FormControl('', [
      Validators.minLength(5),
      Validators.maxLength(30),
      Validators.pattern(/^[a-zA-ZÁÉÍÓÚáéíóúñÑ\s]+$/)
    ]),
    Recompensa: new FormControl('', [
      Validators.maxLength(30),
      Validators.pattern(/^[a-zA-ZÁÉÍÓÚáéíóúñÑ\s]+$/)
    ]),
    RecompensaPequena: new FormControl('', [
      Validators.maxLength(30),
      Validators.pattern(/^[a-zA-ZÁÉÍÓÚáéíóúñÑ0-9\s]+$/)
    ]),
    RecompensaMediana: new FormControl('', [
      Validators.maxLength(30),
      Validators.pattern(/^[a-zA-ZÁÉÍÓÚáéíóúñÑ0-9\s]+$/)
    ]

    ),
    RecompensaGrande: new FormControl('', [
      Validators.maxLength(30),
      Validators.pattern(/^[a-zA-ZÁÉÍÓÚáéíóúñÑ0-9\s]+$/)
    ]),
    TipoObjetivoID: new FormControl(''),
    PictoID: new FormControl('', Validators.required),
    PictoIDRecompensa: new FormControl('')
  });

  formTipoObjetivo = new FormGroup({
    Nombre: new FormControl('', Validators.required)
  });

  formUpdateTipoObj = new FormGroup({
    Nombre: new FormControl('', Validators.required)
  });

  ngOnInit(): void {
    this.cargarTipos();
    this.kidService.getKids().subscribe((datos: any) => {
      this.kids = datos;
      if (datos.length > 0) this.kidActivo = datos[0];
      this.cargarObjetivo();
    });
  }

  seleccionarKid(kid: any) {
    this.kidActivo = kid;
    this.cargarObjetivo();
  }

  seleccionarPerfilYMostrarRecomendaciones(perfil: 'TEA' | 'TDAH'): void {
    this.perfilSeleccionado = perfil;
    this.modalSeleccionTipo = false;
    if (perfil === 'TEA') {
      this.modalRecomendacionesTEA = true;
    } else {
      this.modalRecomendacionesTDAH = true;
    }
  }

  cargarObjetivo() {
    const kidId = this.kidActivo?.KidID ?? null;
    if (!kidId) { this.objetivo = null; return; }

    this.ObjeService.getObjetivos(kidId).subscribe({
      next: (datos: any[]) => {
        this.objetivo = datos.length > 0 ? datos[0] : null;
        this.marcas = this.objetivo?.Marcas ?? Array.from({ length: 4 }, () => Array(5).fill(false));

      },
      error: (err) => console.error('Error al cargar objetivo:', err)
    });
  }

  anyadir(): void {

    if (this.formObjetivo.invalid) {
    this.formObjetivo.markAllAsTouched();
    return;
  }


    if (this.formObjetivo.valid) {
      const formValue: any = {
        ...this.formObjetivo.value,
        KidID: this.kidActivo?.KidID ?? null,
        Perfil: this.perfilSeleccionado
      };
      Object.keys(formValue).forEach(key => {
        if (formValue[key] === '' || formValue[key] === 'undefined') formValue[key] = null;
      });
      this.ObjeService.crear(formValue).subscribe({
        next: () => {
          this.modalAddObjetivo = false;
          this.pictogramaSeleccionado = null;
          this.pictogramaRecompensaSeleccionado = null;
          this.perfilSeleccionado = null;
          this.formObjetivo.reset();
          this.marcas = Array(5).fill(false);
          this.cargarObjetivo();
          this.marcas = Array.from({ length: 4 }, () => Array(5).fill(false));
        },
        error: (err) => console.error('Error:', err)
      });
    }
  }

  eliminarObjetivo() {
    if (!this.objetivo) return;
    if (!confirm('¿Eliminar el objetivo actual? Se borrarán también las marcas.')) return;
    this.ObjeService.eliminar(this.objetivo.ObjetivoID).subscribe(() => {
      this.objetivo = null;
    });
  }

  //---------
  // Tipos
  //---------
  cargarTipos(): void {
    this.ObjeService.getTipos().subscribe(datos => {
      this.tiposObjetivo = Array.isArray(datos) ? datos : (datos as any).data || [];
    });
  }

  abrirAddTipo(): void { this.modalTipo = false; this.modalAddTipo = true; }
  abrirModalEditarTipo(): void { this.modalTipo = false; this.modalEditTipo = true; this.modalAddTipo = false; }
  abrirEditarTipo(tipo: any): void {
    this.tipoSeleccionado = tipo;
    this.formUpdateTipoObj.patchValue({ Nombre: tipo.Nombre });
    this.abrirModalEditarTipo();
  }
  volverAModalTipo(): void { this.modalAddTipo = false; this.modalEditTipo = false; this.modalTipo = true; }

  anyadirTipo(): void {
    if (this.formTipoObjetivo.invalid) return;
    const formValue: any = { ...this.formTipoObjetivo.value };
    Object.keys(formValue).forEach(key => {
      if (formValue[key] === '' || formValue[key] === 'undefined') formValue[key] = null;
    });
    this.ObjeService.crearTipo(formValue).subscribe({
      next: () => { this.volverAModalTipo(); this.formTipoObjetivo.reset(); this.cargarTipos(); },
      error: (err) => console.error('Error:', err)
    });
  }

  actualizarTipo(): void {
    this.ObjeService.actualizarTipos(this.tipoSeleccionado.UniqueID, this.formUpdateTipoObj.value).subscribe({
      next: () => { this.volverAModalTipo(); this.formUpdateTipoObj.reset(); this.cargarTipos(); },
      error: (err) => console.error('Error:', err)
    });
  }

  eliminarTipo(id: number): void {
    this.ObjeService.eliminarTipos(id).subscribe(() => this.cargarTipos());
  }

  //--------------------
  // Pictograma objetivo
  //--------------------
  buscarPictogramas(termino: string): void {
    if (!termino.trim()) { this.resultadosPictograma = []; return; }
    this.cargandoPictograma = true;
    fetch(`https://api.arasaac.org/v1/pictograms/es/search/${encodeURIComponent(termino)}`)
      .then(r => r.json())
      .then((data: any[]) => this.ngZone.run(() => {
        this.resultadosPictograma = (data || []).slice(0, 12);
        this.cargandoPictograma = false;
      }))
      .catch(() => this.ngZone.run(() => {
        this.resultadosPictograma = [];
        this.cargandoPictograma = false;
      }));
  }

  seleccionarPictograma(picto: any): void {
    const pictoData = {
      Titulo: picto.keywords[0]?.keyword ?? 'Pictograma',
      URL: `https://static.arasaac.org/pictograms/${picto._id}/${picto._id}_300.png`
    };
    this.ObjeService.guardarPictograma(pictoData).subscribe({
      next: (saved) => {
        this.pictogramaSeleccionado = { PictoID: saved.PictoID, ...pictoData };
        this.formObjetivo.patchValue({ PictoID: saved.PictoID });
        this.resultadosPictograma = [];
        this.busquedaPictograma = '';
      },
      error: (err) => console.error('Error al guardar pictograma:', err)
    });
  }

  //----------------------
  // Pictograma recompensa
  //----------------------
  buscarPictogramasRecompensa(termino: string): void {
    if (!termino.trim()) { this.resultadosPictogramaRecompensa = []; return; }
    this.cargandoPictogramaRecompensa = true;
    fetch(`https://api.arasaac.org/v1/pictograms/es/search/${encodeURIComponent(termino)}`)
      .then(r => r.json())
      .then((data: any[]) => this.ngZone.run(() => {
        this.resultadosPictogramaRecompensa = (data || []).slice(0, 12);
        this.cargandoPictogramaRecompensa = false;
      }))
      .catch(() => this.ngZone.run(() => {
        this.resultadosPictogramaRecompensa = [];
        this.cargandoPictogramaRecompensa = false;
      }));
  }

  seleccionarPictogramaRecompensa(picto: any): void {
    const pictoData = {
      Titulo: picto.keywords[0]?.keyword ?? 'Pictograma',
      URL: `https://static.arasaac.org/pictograms/${picto._id}/${picto._id}_300.png`
    };
    this.ObjeService.guardarPictograma(pictoData).subscribe({
      next: (saved) => {
        this.pictogramaRecompensaSeleccionado = { PictoID: saved.PictoID, ...pictoData };
        this.formObjetivo.patchValue({ PictoIDRecompensa: saved.PictoID });
        this.resultadosPictogramaRecompensa = [];
        this.busquedaPictogramaRecompensa = '';
      },
      error: (err) => console.error('Error al guardar pictograma recompensa:', err)
    });
  }

  get totalEstrellas(): number {
    return this.marcas.flat().filter(m => m).length;
  }


}