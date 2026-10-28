import { CommonModule } from '@angular/common';
import { Component, OnInit, NgZone, ViewEncapsulation, Query } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { ActividadService } from '../../services/actividad.service';
import { KidService } from '../../services/kid.service';
import esLocale from '@fullcalendar/core/locales/es';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';  // ← añade este import

@Component({
  selector: 'app-calendario',
  standalone: true,
  imports: [FullCalendarModule, CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './calendario.component.html',
  styleUrls: ['./calendario.component.css'],
  encapsulation: ViewEncapsulation.None

})
export class CalendarioComponent implements OnInit {
  abrirModalTipo() {
    throw new Error('Method not implemented.');
  }
  constructor(private ActService: ActividadService, private KidService: KidService, private ngZone: NgZone, private router: Router) { }

  //----------------------
  // Declaracion Variables
  //----------------------
  ModalAct = false;
  modalAddAct = false;
  modalEditAct = false;

  //Saca la fecha actual con el formato YYYY-MM-DD
  today = new Date().toISOString().split('T')[0];

  modalTipo = false;
  ModalAddTipo = false;
  modalEditTipo = false;


  kids: any[] = [];
  kidActivo: any = null;
  kidSeleccionado: any = null;
  actividadSeleccionada: any = null;
  tipoSeleccionado: any = null;
  tiposActividad: any[] = [];
  events: any[] = [];

  busquedaPictograma = '';
  resultadosPictograma: any[] = [];
  cargandoPictograma = false;
  pictogramaSeleccionado: { PictoID: number; Titulo: string; URL: string } | null = null;
  pictogramaEditSeleccionado: { PictoID: number; Titulo: string; URL: string } | null = null;

  calendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin],
    locale: esLocale,
    eventDisplay: 'block',
    events: this.events,
    eventClick: (info: any) => {
      info.jsEvent.preventDefault();
      this.ngZone.run(() => {
        this.actividadSeleccionada = { ...info.event.extendedProps, title: info.event.title };
        this.ModalAct = true;
      });
    }
  };

  //----------------------------
  // Validaciones de formularios
  //----------------------------

  formActividad = new FormGroup({
    Titulo: new FormControl('', [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(50),
      Validators.pattern(/^[a-zA-ZÁÉÍÓÚáéíóúñÑÀàÈèÏïÒòÓóÚúÜüÇç·0-9\s,.# -]+$/)
    ]),
    Descripcion: new FormControl('', [Validators.maxLength(255)]),
    Fecha: new FormControl('', Validators.required),
    Localizacion: new FormControl('', [Validators.pattern(/^[a-zA-ZÁÉÍÓÚáéíóúñÑ0-9\s,.# -]+$/)]),
    Tipo_ActividadesID: new FormControl('', [Validators.required]),
    Hora: new FormControl('', Validators.required),
    PictoID: new FormControl('', Validators.required)

  });

  formUpdateActividad = new FormGroup({
    Titulo: new FormControl('', Validators.required),
    Descripcion: new FormControl(''),
    Fecha: new FormControl('', Validators.required),
    Localizacion: new FormControl('', [Validators.pattern(/^[a-zA-ZÁÉÍÓÚáéíóúñÑ0-9\s,.# -]+$/)]),
    Tipo_ActividadesID: new FormControl(''),
    Hora: new FormControl('', Validators.required),
    PictoID: new FormControl('')
  });

  formTipoActividad = new FormGroup({
    Nombre: new FormControl('', [Validators.required, Validators.maxLength(50), Validators.minLength(1), Validators.pattern(/^[a-zA-ZÁÉÍÓÚáéíóúñÑ0-9\s,.# -]+$/)]),
    Color: new FormControl('#6181ff'),
  });

  formUpdateTipoAct = new FormGroup({
    Nombre: new FormControl('', [Validators.required, Validators.maxLength(50), Validators.minLength(1)]),
    Color: new FormControl('#6181ff'),
  });


  ngOnInit() {
    this.ActService.getTipos().subscribe({
      next: (datos: any) => {
        this.tiposActividad = datos;
      },
    });
    this.KidService.getKids().subscribe({
      next: (kids) => {
        this.kids = kids;
        if (kids.length > 0) {
          this.kidActivo = kids[0];
        }
        this.cargarActividades();
      },
      error: (err) => {
        console.error('Error cargando kids:', err);
        this.cargarActividades();
      }
    });
  }

  cargarActividades(): void {
    const kidId = this.kidActivo?.KidID ?? null;

    if (!kidId) {
      this.events = [];
      this.calendarOptions = { ...this.calendarOptions, events: [] };
      return;
    }

    this.ActService.getActividades(kidId).subscribe((datos: any) => {

      const actividadesDB = datos.map((actividad: any) => {
        const tipo = this.tiposActividad.find(
          (t: any) => t.UniqueID == actividad.Tipo_ActividadesID
        );
        const color = tipo?.Color ?? '#6181ff';
        console.log(actividad.Titulo, '→ tipo encontrado:', tipo, '→ color:', color);

        return {
          title: actividad.Titulo,
          start: actividad.Fecha + 'T' + actividad.Hora,
          backgroundColor: color,
          borderColor: color,
          extendedProps: {
            id: actividad.UniqueID,
            descripcion: actividad.Descripcion,
            localizacion: actividad.Localizacion,
            hora: actividad.Hora,
            fecha: actividad.Fecha,
            tipo_actividadesID: actividad.Tipo_ActividadesID,
            pictoID: actividad.PictoID,
            pictograma: actividad.pictograma ?? null
          }
        };
      });
      this.events = actividadesDB;
      this.calendarOptions = { ...this.calendarOptions, events: this.events };
    });
  }

  seleccionarKid(kid: any): void {
    this.kidActivo = kid;
    this.cargarActividades();
  }

  cargarTipos(): void {
    this.ActService.getTipos().subscribe((datos: any) => {
      this.tiposActividad = datos;
    });
  }


  abrirAddTipo(): void {
    this.modalTipo = false;
    this.modalEditTipo = false;
    this.ModalAddTipo = true;
  }

  abrirModalEditarTipo(): void {
    this.modalTipo = false;
    this.modalEditTipo = true;
    this.ModalAddTipo = false;
  }
  abrirModalEditarAct(): void {
    this.ModalAct = false;
    this.modalEditAct = true;
  }

  volverAModalTipo(): void {
    this.ModalAddTipo = false;
    this.modalEditTipo = false;
    this.modalTipo = true;
  }

  abrirEditarTipo(tipo: any) {
    this.tipoSeleccionado = tipo;
    this.formUpdateTipoAct.patchValue({
      Nombre: tipo.Nombre,
      Color: tipo.Color ?? '#6181ff'
    });
    this.abrirModalEditarTipo();
  }
  abrirEditarAct(tipo?: any) {
    this.formUpdateActividad.patchValue({
      Titulo: this.actividadSeleccionada.title,
      Descripcion: this.actividadSeleccionada.descripcion,
      Fecha: this.actividadSeleccionada.fecha,
      Hora: this.actividadSeleccionada.hora,
      Localizacion: this.actividadSeleccionada.localizacion,
      Tipo_ActividadesID: this.actividadSeleccionada.tipo_actividadesID,
      PictoID: this.actividadSeleccionada.pictoID ?? ''
    });
    this.pictogramaEditSeleccionado = this.actividadSeleccionada.pictograma ?? null;
    this.abrirModalEditarAct();
  }

  anyadir(): void {
    if (this.formActividad.valid) {
      const formValue: any = { ...this.formActividad.value, KidID: this.kidActivo?.KidID ?? null };
      Object.keys(formValue).forEach(key => {
        if (formValue[key] === '' || formValue[key] === 'undefined') {
          formValue[key] = null;
        }
      });
      this.ActService.crear(formValue).subscribe({
        next: () => {
          this.modalAddAct = false;
          this.pictogramaSeleccionado = null;
          this.formActividad.reset();
          this.cargarActividades();
        },
        error: (err) => console.error('Error:', err)
      });
    }
  }

  anyadirTipo(): void {
    if (this.formTipoActividad.valid) {
      const formValue: any = { ...this.formTipoActividad.value };
      Object.keys(formValue).forEach(key => {
        if (formValue[key] === '' || formValue[key] === 'undefined') formValue[key] = null;
      });
      this.ActService.crearTipo(formValue).subscribe({
        next: () => {
          this.volverAModalTipo();
          this.formTipoActividad.reset();
          this.cargarTipos();
        },
        error: (err) => console.error('Error:', err)
      });
    }
  }

  eliminar(id: number) {
    this.ActService.eliminar(id).subscribe(() => {
      this.ActService.getTipos().subscribe((datos: any) => {
        this.tiposActividad = datos;
      });
    });
  }

  actualizar() {
    this.ActService.actualizar(this.tipoSeleccionado.UniqueID, this.formUpdateTipoAct.value).subscribe({
      next: () => {
        this.volverAModalTipo();
        this.cargarTipos();
        this.formUpdateTipoAct.reset();
      },
      error: (err) => console.error('Error:', err)
    });
  }
  eliminarAct(id: number) {
    this.ActService.eliminarAct(id).subscribe(() => {
      this.ModalAct = false;
      this.cargarActividades();
    });
  }

  actualizarAct() {
    this.ActService.actualizarAct(this.actividadSeleccionada.id, this.formUpdateActividad.value).subscribe({
      next: () => {
        this.modalEditAct = false;
        this.cargarActividades();
        this.formUpdateTipoAct.reset();
      },
      error: (err) => console.error('Error:', err)
    });
  }

 irAVistaNino() {
  const pin = prompt("Introduce el nombre del niño para acceder:");
  if (!pin) return;

  if (pin.trim().toLowerCase() === this.kidActivo?.Nombre?.toLowerCase()) {
    this.router.navigate(['/calendario-nino'], {
      queryParams: { kidId: this.kidActivo?.KidID }
    });
  } else {
    alert("Nombre incorrecto.");
  }
}

  buscarPictogramas(termino: string): void {
    if (!termino.trim()) { this.resultadosPictograma = []; return; }
    this.cargandoPictograma = true;
    const url = `https://api.arasaac.org/v1/pictograms/es/search/${encodeURIComponent(termino)}`;
    fetch(url)
      .then(r => r.json())
      .then((data: any[]) => {
        this.ngZone.run(() => {
          this.resultadosPictograma = (data || []).slice(0, 12);
          this.cargandoPictograma = false;
        });
      })
      .catch(() => this.ngZone.run(() => {
        this.resultadosPictograma = [];
        this.cargandoPictograma = false;
      }));
  }

  seleccionarPictograma(picto: any, form: 'crear' | 'editar'): void {
    const pictoData = {
      Titulo: picto.keywords[0]?.keyword ?? 'Pictograma',
      URL: `https://static.arasaac.org/pictograms/${picto._id}/${picto._id}_300.png`
    };
    // Guardamos en BBDD y obtenemos PictoID
    this.ActService.guardarPictograma(pictoData).subscribe({
      next: (saved) => {
        const pictoConId = { PictoID: saved.PictoID, ...pictoData };
        if (form === 'crear') {
          this.pictogramaSeleccionado = pictoConId;
          this.formActividad.patchValue({ PictoID: saved.PictoID });
        } else {
          this.pictogramaEditSeleccionado = pictoConId;
          this.formUpdateActividad.patchValue({ PictoID: saved.PictoID });
        }
        this.resultadosPictograma = [];
        this.busquedaPictograma = '';
      },
      error: (err) => console.error('Error guardando pictograma:', err)
    });
  }
}