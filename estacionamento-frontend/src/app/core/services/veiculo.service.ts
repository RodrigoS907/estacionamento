import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Veiculo, VeiculoRequest } from '../models/veiculo.model';

@Injectable({ providedIn: 'root' })
export class VeiculoService {
  private readonly api = `${environment.apiUrl}/veiculos`;

  constructor(private http: HttpClient) {}

  listar(): Observable<Veiculo[]> { return this.http.get<Veiculo[]>(this.api); }
  buscar(id: number): Observable<Veiculo> { return this.http.get<Veiculo>(`${this.api}/${id}`); }
  criar(req: VeiculoRequest): Observable<Veiculo> { return this.http.post<Veiculo>(this.api, req); }
  atualizar(id: number, req: VeiculoRequest): Observable<Veiculo> { return this.http.put<Veiculo>(`${this.api}/${id}`, req); }
  excluir(id: number): Observable<void> { return this.http.delete<void>(`${this.api}/${id}`); }
}
