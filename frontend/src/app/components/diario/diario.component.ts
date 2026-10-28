import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DiarioService } from '../../services/diario.service';
import { AuthService } from '../../services/auth.service';
import { KidService } from '../../services/kid.service';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-diario',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './diario.component.html',
})

export class DiarioComponent implements OnInit {
  private service = inject(DiarioService);
  private authService = inject(AuthService);
  private kidService = inject(KidService);
  private fb = inject(FormBuilder);

  kids: any[] = [];
  kidActivo: any = null;
  entradas: any[] = [];
  cargando = true;
  modalAbierto = false;
  guardando = false;
  entradaEditando: any = null;
  comportamientoPulsado = false;

  comportamientosSeleccionados: string[] = [];

  // Semáforo: 3 estados con color
  estados = [
    { valor: 'bien', color: '#4ade80' }, // verde
    { valor: 'normal', color: '#facc15' }, // amarillo
    { valor: 'mal', color: '#f87171' }, // rojo
  ];

  comportamientos = [
    'Tranquilo/a', 'Activo/a', 'Irritable', 'Concentrado/a',
    'Disperso/a', 'Sociable', 'Retraído/a', 'Colaborador/a',
    'Agresivo/a', 'Alegre', 'Lloroso/a', 'Comunicativo/a',
  ];


  form: FormGroup = this.fb.group({
    fecha: [new Date().toISOString().split('T')[0], Validators.required],
    estado: ['bien', Validators.required],
    descripcion: ['', [Validators.required, Validators.maxLength(1000), Validators.minLength(5), Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s.,¿?¡! ]*$/)]],
    logros: ['', [Validators.maxLength(500), Validators.minLength(5), Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s.,¿?¡! ]*$/)]],
    notas: ['', [Validators.maxLength(500), Validators.minLength(5), Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s.,¿?¡! ]*$/)]],
  });

  ngOnInit(): void {
    this.cargarKids();
  }

  private cargarKids(): void {
    this.kidService.getKids().subscribe({
      next: kids => {
        this.kids = kids;
        if (kids.length > 0) {
          this.seleccionarKid(kids[0]);
        } else {
          this.cargando = false;
        }
      },
      error: () => { this.cargando = false; }
    });
  }

  seleccionarKid(kid: any): void {
    this.kidActivo = kid;
    this.cargarEntradas();
  }

  private cargarEntradas(): void {
    this.cargando = true;
    this.service.getEntradas(this.kidActivo.KidID).subscribe({
      next: data => {
        this.entradas = data;
        this.cargando = false;
      },
      error: () => { this.cargando = false; }
    });
  }

  abrirModal(): void {
    this.entradaEditando = null;
    this.comportamientosSeleccionados = [];
    this.comportamientoPulsado = false;
    this.form.reset({
      fecha: new Date().toISOString().split('T')[0],
      estado: 'bien',
    });
    this.modalAbierto = true;
  }

  abrirEditar(entrada: any): void {
    this.entradaEditando = entrada;
    this.comportamientosSeleccionados = entrada.comportamientos ? [...entrada.comportamientos] : [];
    this.comportamientoPulsado = false;
    this.form.patchValue({
      fecha: entrada.fecha,
      estado: entrada.estado,
      descripcion: entrada.descripcion,
      logros: entrada.logros || '',
      notas: entrada.notas || '',
    });
    this.modalAbierto = true;
  }

  cerrarModal(): void {
    this.modalAbierto = false;
    this.entradaEditando = null;
  }

  toggleComportamiento(c: string): void {
    this.comportamientoPulsado = true;
    const idx = this.comportamientosSeleccionados.indexOf(c);
    if (idx >= 0) {
      this.comportamientosSeleccionados.splice(idx, 1);
    } else {
      this.comportamientosSeleccionados.push(c);
    }
  }

  guardarEntrada(): void {
    this.form.markAllAsTouched();
    this.comportamientoPulsado = true;

    if (this.comportamientosSeleccionados.length === 0) {
      return;
    }

    if (this.form.invalid || this.guardando) return;
    this.guardando = true;

    const payload = {
      ...this.form.value,
      kid_id: this.kidActivo.KidID,
      comportamientos: this.comportamientosSeleccionados,
    };

    if (this.entradaEditando) {
      this.service.actualizar(this.entradaEditando.id, payload).subscribe({
        next: actualizada => {
          const idx = this.entradas.findIndex(e => e.id === actualizada.id);
          if (idx >= 0) this.entradas[idx] = actualizada;
          this.guardando = false;
          this.cerrarModal();
        },
        error: () => { this.guardando = false; }
      });
    } else {
      this.service.crear(payload).subscribe({
        next: nueva => {
          this.entradas = [nueva, ...this.entradas];
          this.guardando = false;
          this.cerrarModal();
        },
        error: () => { this.guardando = false; }
      });
    }
  }

  eliminarEntrada(entrada: any): void {
    if (!confirm(`¿Eliminar la entrada del ${this.formatearFecha(entrada.fecha)}?`)) return;
    this.service.eliminar(entrada.id).subscribe({
      next: () => {
        this.entradas = this.entradas.filter(e => e.id !== entrada.id);
      },
      error: err => console.error('Error al eliminar', err)
    });
  }

  getColor(valor: string): string {
    return this.estados.find(e => e.valor === valor)?.color ?? '#9ca3af';
  }


  // Formatear fecha
  formatearFecha(fecha: string): string {
    const [y, m, d] = fecha.split('-');
    const date = new Date(Number(y), Number(m) - 1, Number(d));
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }
  exportarPDF(): void {
    if (!confirm(`¿Exportar el diario de ${this.kidActivo?.Nombre ?? 'tu hijo/a'} a PDF?`)) return;

    const doc = new jsPDF();
    const nombreKid = this.kidActivo?.Nombre ?? 'Infante';
    const apellidoKid = this.kidActivo?.Apellidos ?? 'Apellido';

    const fechaExport = new Date().toLocaleDateString('es-ES', {
      day: 'numeric', month: 'long', year: 'numeric'
    });

    // ── Cabecera ──
    doc.setFillColor(99, 102, 241); // indigo
    doc.rect(0, 0, 210, 28, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text(`Informe de comportamiento de ${nombreKid} ${apellidoKid}`, 14, 12);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(`Exportado el ${fechaExport}`, 14, 21);

    let y = 38;

    this.entradas.forEach((entrada, i) => {
      const colorMap: Record<string, [number, number, number]> = {
        bien: [74, 222, 128],
        normal: [250, 204, 21],
        mal: [248, 113, 113],
      };
      const color = colorMap[entrada.estado] ?? [156, 163, 175];

      // Salto de página si no cabe
      if (y > 260) {
        doc.addPage();
        y = 20;
      }

      // Franja de color semáforo
      doc.setFillColor(...color);
      doc.rect(14, y, 4, 24, 'F');

      // Fecha y estado
      doc.setTextColor(30, 30, 30);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text(this.formatearFecha(entrada.fecha), 22, y + 7);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100);
      doc.text(entrada.estado.charAt(0).toUpperCase() + entrada.estado.slice(1), 22, y + 14);

      y += 28;

      // Descripción
      if (entrada.descripcion) {
        doc.setTextColor(50, 50, 50);
        doc.setFontSize(9);
        const lines = doc.splitTextToSize(entrada.descripcion, 172);
        doc.text(lines, 14, y);
        y += lines.length * 5 + 4;
      }

      // Comportamientos
      if (entrada.comportamientos?.length > 0) {
        doc.setTextColor(99, 102, 241);
        doc.setFontSize(8);
        doc.text('Comportamiento: ' + entrada.comportamientos.join(', '), 14, y);
        y += 7;
      }

      // Logros
      if (entrada.logros) {
        doc.setTextColor(34, 197, 94);
        doc.setFontSize(8);
        const logrosLines = doc.splitTextToSize('Logros: ' + entrada.logros, 172);
        doc.text(logrosLines, 14, y);
        y += logrosLines.length * 5 + 3;
      }

      // Notas
      if (entrada.notas) {
        doc.setTextColor(120, 120, 120);
        doc.setFontSize(8);
        const notasLines = doc.splitTextToSize('Notas: ' + entrada.notas, 172);
        doc.text(notasLines, 14, y);
        y += notasLines.length * 5 + 3;
      }

      // Separador
      doc.setDrawColor(220, 220, 220);
      doc.line(14, y, 196, y);
      y += 8;
    });

    doc.save(`Informe-${nombreKid.toLowerCase()} ${apellidoKid.toLowerCase()}.pdf`);
  }
}