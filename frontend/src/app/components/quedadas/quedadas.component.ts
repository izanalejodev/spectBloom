import {
  Component, OnInit,
  OnDestroy,
  AfterViewInit,
  ViewChild,
  ElementRef,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { QuedadasService } from '../../services/quedadas.service';
import { AuthService } from '../../services/auth.service';

declare const L: any;

@Component({
  selector: 'app-quedadas',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './quedadas.component.html',
  styleUrl: './quedadas.component.css'
})
export class QuedadasComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('mapEl') mapEl!: ElementRef;
  @ViewChild('modalMapEl') modalMapEl!: ElementRef;

  private service = inject(QuedadasService);
  public authService = inject(AuthService);
  private fb = inject(FormBuilder);

  usuarioActualId: number | null = null;

  tipos: string[] = [];
  quedadas: any[] = [];
  quedadaPendiente: any = null;
  quedadaSeleccionada: any = null;
  busquedaDireccion = '';
  buscandoDireccion = false;
  errorDireccion = '';
  inscribiendose = false;
  inscritosVisibles: Set<number> = new Set();
  modalAbierto = false;
  modalEditarAbierto = false;
  quedadaEditando: any = null;
  modalInscripcionAbierto = false;
  modalInscritosAbierto = false;
  cargando = true;
  guardando = false;

  private map: any = null;
  private modalMap: any = null;
  private modalMarker: any = null;

  form: FormGroup = this.fb.group({
Titulo: ['', [Validators.required, Validators.maxLength(50), Validators.minLength(5), Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚàèìòùÀÈÌÒÙäëïöüÄËÏÖÜâêîôûÂÊÎÔÛçÇñÑ·\s]+$/)]],    tipo: ['Actividad al aire libre', Validators.required],
    descripcion: ['', [Validators.required, Validators.maxLength(500), Validators.minLength(5), Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚàèìòùÀÈÌÒÙäëïöüÄËÏÖÜâêîôûÂÊÎÔÛçÇñÑ·\s]+$/)]],
    Fecha: ['', Validators.required],
    Hora: ['', Validators.required],
    lugar: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9áéíóúÁÉÍÓÚàèìòùÀÈÌÒÙäëïöüÄËÏÖÜâêîôûÂÊÎÔÛçÇñÑ·\s.,\-\/#ºª']+$/)]],
    lat: [null as number | null],
    lng: [null as number | null],
    MaxAsistentes: [10, [Validators.required, Validators.min(1), Validators.max(100)]],
  });

  formEditar: FormGroup = this.fb.group({
    MaxAsistentes: [10, [Validators.required, Validators.min(1), Validators.max(100)]]
  });

  formInscripcion: FormGroup = this.fb.group({
    nombre_familiar: ['', [Validators.required, Validators.maxLength(100), Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]+$/)]],
    ninos: this.fb.array([])
  });

  fechaMinima: string = new Date().toISOString().split('T')[0];

  ngOnInit(): void {
    const user = this.authService.getUser();
    if (user && user.id) {
      this.usuarioActualId = Number(user.id);
    }
    this.cargarQuedadas();
    this.cargarTipos();
  }

  ngAfterViewInit(): void {
    this.cargarLeaflet().then(() => this.initMainMap());
  }

  ngOnDestroy(): void {
    this.map?.remove();
    this.modalMap?.remove();
  }

  esMiQuedada(q: any): boolean {
  if (this.authService.isAdmin()) return true;
  if (!this.usuarioActualId || !q.user_id) return false;
  return Number(q.user_id) === this.usuarioActualId;
}

  guardarQuedada(): void {
    if (this.form.invalid || this.guardando) return;
    this.guardando = true;
    this.service.create(this.form.value).subscribe({
      next: nueva => {
        this.quedadas = [nueva, ...this.quedadas];
        this.guardando = false;
        this.cerrarModal();
        setTimeout(() => this.pintarMarcadoresMainMap(), 100);
      },
      error: () => { this.guardando = false; }
    });
  }

  editarQuedadas(q: any): void {
    this.quedadaEditando = q;
    this.formEditar.setControl('MaxAsistentes',
      this.fb.control(q.plazas_totales, [
        Validators.required,
        Validators.min(q.plazas_ocupadas || 1),
        Validators.max(100)
      ])
    );
    this.modalEditarAbierto = true;
  }

  cerrarEditarQuedadas(): void {
    this.modalEditarAbierto = false;
    this.quedadaEditando = null;
  }

  guardarEdicion(): void {
    if (this.formEditar.invalid || this.guardando) return;
    this.guardando = true;

    this.service.actualizar(this.quedadaEditando.id, this.formEditar.value).subscribe({
      next: (actualizada: any) => {
        const idx = this.quedadas.findIndex(x => x.id === this.quedadaEditando.id);
        if (idx !== -1) this.quedadas[idx].plazas_totales = actualizada.plazas_totales;
        this.guardando = false;
        this.cerrarEditarQuedadas();
      },
      error: () => { this.guardando = false; }
    });
  }

  eliminarQuedada(q: any): void {
    if (!confirm(`¿Eliminar "${q.titulo}"?`)) return;
    this.service.eliminar(q.id).subscribe({
      next: () => {
        this.quedadas = this.quedadas.filter(x => x.id !== q.id);
        this.pintarMarcadoresMainMap();
      },
      error: (err) => console.error("Error al eliminar", err)
    });
  }

  get misQuedadas(): any[] {
    return this.quedadas.filter(q => this.esMiQuedada(q));
  }

  get quedadasAjenas(): any[] {
    return this.quedadas.filter(q => !this.esMiQuedada(q));
  }

  abrirModal(): void {
    this.modalAbierto = true;
    this.form.reset({ tipo: 'Actividad al aire libre', MaxAsistentes: 10 });
    this.busquedaDireccion = '';
    this.errorDireccion = '';
    this.modalMarker = null;
    setTimeout(() => this.initModalMap(), 150);
  }

  cerrarModal(): void {
    this.modalAbierto = false;
    this.modalMap?.remove();
    this.modalMap = null;
    this.modalMarker = null;
  }

  buscarDireccion(): void {
    const q = this.busquedaDireccion.trim();
    if (!q) return;
    this.buscandoDireccion = true;
    this.errorDireccion = '';
    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&countrycodes=es&limit=1`, {
      headers: { 'Accept-Language': 'es' },
    })
      .then(r => r.json())
      .then(data => {
        this.buscandoDireccion = false;
        if (!data.length) { this.errorDireccion = 'No se encontró la dirección.'; return; }
        const { lat, lon, display_name } = data[0];
        this.colocarMarcador(parseFloat(lat), parseFloat(lon));
        this.form.patchValue({ lugar: display_name });
        this.busquedaDireccion = display_name;
      })
      .catch(() => { this.buscandoDireccion = false; this.errorDireccion = 'Error al buscar.'; });
  }

  private cargarQuedadas(): void {
    this.cargando = true;
    this.service.getAll().subscribe({
      next: data => {
        this.quedadas = data;
        this.cargando = false;
        setTimeout(() => this.pintarMarcadoresMainMap(), 100);
      },
      error: () => { this.cargando = false; }
    });
  }

  private cargarTipos(): void {
    this.service.getTipos().subscribe({
      next: data => {
        this.tipos = data.map((t: any) => t.nombre);
      },
      error: (err) => console.error('Error cargando tipos:', err)
    });
  }

  private cargarLeaflet(): Promise<void> {
    if ((window as any).L) return Promise.resolve();
    return new Promise(resolve => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = () => resolve();
      document.head.appendChild(script);
    });
  }

  private markerIcon() {
    return L.divIcon({
      html: '<div style="width:14px;height:14px;background:#a5b4fc;border:3px solid #fff;border-radius:50%;box-shadow:0 1px 4px rgba(0,0,0,.25)"></div>',
      iconSize: [14, 14],
      iconAnchor: [7, 7],
      className: ''
    });
  }

  private initMainMap(): void {
    if (!this.mapEl?.nativeElement || this.map) return;
    this.map = L.map(this.mapEl.nativeElement).setView([41.394, 2.17], 13);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19, attribution: '© OpenStreetMap © CARTO',
    }).addTo(this.map);
    L.control.scale({ imperial: false }).addTo(this.map);
    this.pintarMarcadoresMainMap();
  }

  private pintarMarcadoresMainMap(): void {
    if (!this.map) return;
    this.map.eachLayer((l: any) => { if (l instanceof L.Marker) this.map.removeLayer(l); });
    this.quedadas.forEach(q => {
      L.marker([q.lat, q.lng], { icon: this.markerIcon() })
        .addTo(this.map)
        .bindPopup(`<strong style="font-size:13px">${q.titulo}</strong><br><span style="font-size:12px;color:#888">${q.lugar}</span>`);
    });
  }

  private initModalMap(): void {
    if (!this.modalMapEl?.nativeElement) return;
    this.modalMap = L.map(this.modalMapEl.nativeElement).setView([41.394, 2.17], 13);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19, attribution: '© OpenStreetMap © CARTO',
    }).addTo(this.modalMap);
    this.modalMap.on('click', (e: any) => this.colocarMarcador(e.latlng.lat, e.latlng.lng));
  }

  private colocarMarcador(lat: number, lng: number): void {
    if (this.modalMarker) this.modalMap.removeLayer(this.modalMarker);
    this.modalMarker = L.marker([lat, lng], { icon: this.markerIcon() }).addTo(this.modalMap);
    this.modalMap.setView([lat, lng], 15);
    this.form.patchValue({ lat, lng });
    if (!this.form.value.lugar) this.form.patchValue({ lugar: `${lat.toFixed(5)}, ${lng.toFixed(5)}` });
  }

  esPasada(q: any): boolean {
    const fechaHora = new Date(q.fecha + 'T' + q.hora);
    return fechaHora < new Date();
  }

  valorar(q: any, estrellas: number): void {
    this.service.valorar(q.id, estrellas).subscribe({
      next: (res: any) => {
        q.ya_valorado = true;
        q.media_valoracion = res.media;
      },
      error: (err) => console.error('Error al valorar:', err)
    });
  }

  toggleInscripcion(q: any): void {
    if (q.inscrito) {
      if (!confirm(`¿Seguro que quieres desapuntarte de "${q.titulo}"?`)) return;
      this.service.cancelarInscripcion(q.id).subscribe(res => {
        q.inscrito = false;
        q.plazas_ocupadas = res.plazas_ocupadas;
      });
    } else {
      if (this.plazasLibres(q) === 0) return;
      this.quedadaPendiente = q;
      this.formInscripcion.reset();
      this.limpiarYPrepararNinos();
      this.modalInscripcionAbierto = true;
    }
  }

  confirmarInscripcion(): void {
  if (this.formInscripcion.invalid || this.inscribiendose) return;
  this.inscribiendose = true;
  const q = this.quedadaPendiente;

  const valoresForm = this.formInscripcion.value;
  const nombreFamiliar = valoresForm.nombre_familiar;
  const listaNinos = valoresForm.ninos || [];

  // 1. Unificamos Nombre y Edad de cada niño en un formato legible
  // Ejemplo: "Marc (2 años), Lucas (10 años)"
  const ninosConEdadFormateada = listaNinos.map((n: any) => {
    const nombre = n.nombreNino?.trim() || 'Niño';
    const edad = n.edadNino !== null && n.edadNino !== undefined ? n.edadNino : '?';
    return `${nombre} (${edad} años)`;
  }).join(', ');

  // 2. Tomamos la edad del primer niño de la lista para enviársela como número puro a Laravel
  const primeraEdadEntera = listaNinos.length > 0 ? Number(listaNinos[0].edadNino) : 0;

  // 3. Estructuramos el objeto que hace feliz a Laravel
  const datosMapeadosParaBackend = {
    nombre_familiar: nombreFamiliar,
    nombre_nino: ninosConEdadFormateada,  // Guarda aquí toda la información: nombres y edades juntas
    edad_nino: primeraEdadEntera          // Envía un número entero válido para saltarse la validación 422
  };

  // 4. Enviamos la petición única al servidor
  this.service.inscribirse(q.id, datosMapeadosParaBackend).subscribe({
    next: (res) => {
      q.inscrito = true;
      
      // Sumamos a la interfaz la cantidad real de niños apuntados en este formulario
      q.plazas_ocupadas = (q.plazas_ocupadas || 0) + listaNinos.length;

      this.inscribiendose = false;
      this.modalInscripcionAbierto = false;
      this.quedadaPendiente = null;
    },
    error: (err) => {
      console.error("Error devuelto por el servidor:", err);
      this.inscribiendose = false;
      alert("Hubo un problema al tramitar tu inscripción. Comprueba los datos.");
    }
  });
}

  cerrarModalInscripcion(): void {
    this.modalInscripcionAbierto = false;
    this.quedadaPendiente = null;
  }

  toggleInscritos(id: number): void {
    this.inscritosVisibles.has(id)
      ? this.inscritosVisibles.delete(id)
      : this.inscritosVisibles.add(id);
  }

  plazasLibres(q: any): number {
    return q.plazas_totales - q.plazas_ocupadas;
  }

  onKeydown(e: KeyboardEvent): void {
    if (e.key === 'Enter') { e.preventDefault(); this.buscarDireccion(); }
  }

  abrirModalInscritos(q: any): void {
    this.quedadaSeleccionada = q;
    this.modalInscritosAbierto = true;
    if (this.mapEl?.nativeElement) {
      this.mapEl.nativeElement.style.zIndex = '0';
    }
  }

  cerrarModalInscritos(): void {
    this.modalInscritosAbierto = false;
    this.quedadaSeleccionada = null;
    if (this.mapEl?.nativeElement) {
      this.mapEl.nativeElement.style.zIndex = '';
    }
  }

  // ─── Gestión de FormArray de Niños ───────────────────────────────

  get ninosControls(): FormArray {
    return this.formInscripcion.get('ninos') as FormArray;
  }

  crearFormGrupoNino(): FormGroup {
    return this.fb.group({
      nombreNino: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]+$/)]],
      edadNino: ['', [Validators.required, Validators.min(1), Validators.max(18)]]
    });
  }

  agregarNino(): void {
    this.ninosControls.push(this.crearFormGrupoNino());
  }

  eliminarNino(index: number): void {
    this.ninosControls.removeAt(index);
  }

  private limpiarYPrepararNinos(): void {
    const ninos = this.ninosControls;
    while (ninos.length !== 0) {
      ninos.removeAt(0);
    }
    this.agregarNino();
  }
}