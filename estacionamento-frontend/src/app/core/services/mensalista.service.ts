import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Mensalista, MensalistaRequest } from '../models/mensalista.model';

@Injectable({ providedIn: 'root' })
export class MensalistaService {
  private readonly api = `${environment.apiUrl}/mensalistas`;

  constructor(private http: HttpClient) {}

  listar(): Observable<Mensalista[]> { return this.http.get<Mensalista[]>(this.api); }
  buscar(id: number): Observable<Mensalista> { return this.http.get<Mensalista>(`${this.api}/${id}`); }
  criar(req: MensalistaRequest): Observable<Mensalista> { return this.http.post<Mensalista>(this.api, req); }
  atualizar(id: number, req: MensalistaRequest): Observable<Mensalista> { return this.http.put<Mensalista>(`${this.api}/${id}`, req); }
  inativar(id: number): Observable<void> { return this.http.delete<void>(`${this.api}/${id}`); }
}
