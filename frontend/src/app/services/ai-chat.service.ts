import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

@Injectable({
  providedIn: 'root'
})
export class AiChatService {
  // Usamos /api/ai/chat — las rutas de api.php no tienen CSRF
  private apiUrl = `${environment.apiUrl}/ai/chat`;

  constructor(private http: HttpClient) {}

  sendMessage(message: string, model: string = 'mistral'): Observable<any> {
    return this.http.post(this.apiUrl, { message, model });
  }
}