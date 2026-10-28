import { Component, ElementRef, ViewChild, AfterViewChecked, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AiChatService, ChatMessage } from '../../services/ai-chat.service';

@Component({
  selector: 'app-ai-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ai-chat.component.html',
  styleUrl: './ai-chat.component.css'
})
export class AiChatComponent implements AfterViewChecked, OnChanges {
  @ViewChild('messagesContainer') messagesContainer!: ElementRef;
  @Input() forzarAbierto = false;
  @Output() cerrado = new EventEmitter<void>();

  abierto = false;
  mensajes: ChatMessage[] = [];
  inputMensaje = '';
  cargando = false;
  modelo = 'tinyllama';

  constructor(private aiChatService: AiChatService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['forzarAbierto'] && this.forzarAbierto && !this.abierto) {
      this.abrirChat();
    }
  }

  ngAfterViewChecked() {
    this.scrollAlFinal();
  }

  abrirChat() {
    this.abierto = true;
    if (this.mensajes.length === 0) {
      this.mensajes.push({
        role: 'assistant',
        content: '¡Hola! Soy tu asistente de SpectBloom. ¿En qué puedo ayudarte hoy? '
      });
    }
  }

  toggleChat() {
    if (this.abierto) {
      this.abierto = false;
      this.cerrado.emit();
    } else {
      this.abrirChat();
    }
  }

  enviar() {
    const texto = this.inputMensaje.trim();
    if (!texto || this.cargando) return;
    this.mensajes.push({ role: 'user', content: texto });
    this.inputMensaje = '';
    this.cargando = true;
   this.aiChatService.sendMessage(texto, this.modelo).subscribe({
  next: (res) => {
    // Si res.response existe, lo usamos. Si no, verificamos si 'res' mismo es el texto.
    const respuestaTexto = res.response || (typeof res === 'string' ? res : 'No obtuve respuesta del servidor.');
    
    this.mensajes.push({ role: 'assistant', content: respuestaTexto });
    this.cargando = false;
  },
  error: (err) => {
    console.error('Error de API:', err); // Esto te dirá en la consola si es un error 404, 500 o CORS
    this.mensajes.push({ role: 'assistant', content: 'Lo siento, hubo un error de conexión.' });
    this.cargando = false;
  }
});
  }

  onKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.enviar();
    }
  }

  limpiarChat() {
    this.mensajes = [{ role: 'assistant', content: '¡Hola! Soy tu asistente de SpectBloom. ¿En qué puedo ayudarte hoy? ' }];
  }

  private scrollAlFinal() {
    if (this.messagesContainer) {
      const el = this.messagesContainer.nativeElement;
      el.scrollTop = el.scrollHeight;
    }
  }
}