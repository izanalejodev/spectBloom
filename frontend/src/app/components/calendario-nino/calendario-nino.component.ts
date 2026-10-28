import { Component, ViewChild, AfterViewInit, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FullCalendarModule, FullCalendarComponent } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import { Router, ActivatedRoute } from '@angular/router';
import { CalendarioService } from '../../services/calendario.service';
import { KidService } from '../../services/kid.service';
import { ActividadService } from '../../services/actividad.service';

@Component({
  selector: 'app-calendario-nino',
  standalone: true,
  imports: [FullCalendarModule, CommonModule, FormsModule],
  templateUrl: './calendario-nino.component.html',
  styleUrl: './calendario-nino.component.css',
  encapsulation: ViewEncapsulation.None  
})
export class CalendarioNinoComponent implements AfterViewInit, OnInit {
  @ViewChild('calendar') calendarComponent!: FullCalendarComponent;
  mesActual = '';
  KidID: number = 0;


  actividadesHoy: any[] = [];
  events: any[] = [];
  nombreNino: String = '';

  calendarOptions: any = {
    initialView: 'dayGridWeek',
    plugins: [dayGridPlugin],
    events: [],
    locale: 'es',
    firstDay: 1,
    height: 'auto',
    headerToolbar: false,
    dayMaxEvents: 3,
    eventDidMount: (info: any) => {
      const dot = info.el.querySelector('.fc-daygrid-event-dot');
      if (dot) dot.remove();
    },
    eventContent: (arg: any) => {
  const url = arg.event.extendedProps.pictogramaUrl;
  const titulo = arg.event.title;

  if (url) {
    return {
      html: `
        <div class="flex flex-col items-center gap-1 px-1 py-1 w-full">
          <img src="${url}" alt="${titulo}" class="w-30 h-30 object-contain rounded-lg bg-white" />
          <span class="text-[11px] font-semibold text-center leading-tight break-words whitespace-normal">${titulo}</span>
        </div>
      `
    };
  }
  return {
    html: `<div class="flex items-center px-1 py-1 w-full">
             <span class="text-[11px] font-semibold">${titulo}</span>
           </div>`
  };
}

  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private calendarioService: CalendarioService,
    private kidService: KidService,
    private actividadService: ActividadService) { }

  async ngOnInit() {
    this.route.queryParams.subscribe(async params => {
      const KidIDParams = +params['kidId'];

      if (!KidIDParams) {
        console.log('No ha llegado el KidId por la URL');
        return;
      }
      this.KidID = KidIDParams;

      await this.CargarNombreNiño();
      await this.cargarDatosHoy();
    });
  }

  async CargarNombreNiño() {
    this.kidService.getKids().subscribe((kids: any[]) => {
      const kid = kids.find(k => k.KidID === this.KidID);
      this.nombreNino = kid ? kid.Nombre : '';
      console.log('Nombre encontrado:', this.nombreNino);
    });
  }


  async cargarDatosHoy() {
    this.actividadService.getActividades(this.KidID).subscribe((datos: any) => {
      console.log('Actividades recibidas:', datos);
      this.actividadesHoy = datos;
      this.calendarOptions = {
        ...this.calendarOptions,
        events: datos.map((a: any) => ({
          title: a.Titulo,
          start: a.Fecha + 'T' + a.Hora,
          classNames: ['event-default'],
          extendedProps: {
            pictogramaUrl: a.pictograma?.URL ?? null
          }
        }))
      };
    });
  }

  ngAfterViewInit() {
    setTimeout(() => this.actualizarTitulo(), 0);
  }



  //Metodos para pasar de semanas y meses 
  anterior() {
    this.calendarComponent.getApi().prev();
    this.actualizarTitulo();
  }

  siguiente() {
    this.calendarComponent.getApi().next();
    this.actualizarTitulo();
  }

  actualizarTitulo() {
    this.mesActual = this.calendarComponent.getApi().view.title;
  }

  //Boton para cambiar a la vista del padre una vez pones el codigo correcto
  irAVistaPadre() {
  const pin = prompt("Introduce el nombre del niño para salir:");
  if (pin?.trim().toLowerCase() === this.nombreNino?.toString().toLowerCase()) {
    this.router.navigate(['/calendario']);
  } else {
    alert("Nombre incorrecto.");
  }
}

}