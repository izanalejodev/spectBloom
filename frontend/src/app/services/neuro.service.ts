import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NeuroService {

  private apiUrl = 'https://api.openalex.org/works';

  constructor(private http: HttpClient) {}

  getArticulos(): Observable<any> {
    return this.http.get(this.apiUrl, {
      params: {
        filter: 'title.search:autism,is_oa:true',
        per_page: '6'
      }
    });
  }
}