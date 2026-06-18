import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { RegistroAcesso, OcrResponse } from '../models/registro-acesso.model';

@Injectable({ providedIn: 'root' })
export class AcessoService {
  private readonly api = `${environment.apiUrl}/acessos`;
  private readonly ocrApi = `${environment.apiUrl}/ocr`;

  constructor(private http: HttpClient) {}

  listarAbertos(): Observable<RegistroAcesso[]> {
    return this.http.get<RegistroAcesso[]>(`${this.api}?abertos=true`);
  }

  listarTodos(): Observable<RegistroAcesso[]> {
    return this.http.get<RegistroAcesso[]>(this.api);
  }

  reconhecerPlaca(foto: Blob): Observable<OcrResponse> {
    const form = new FormData();
    form.append('foto', foto, 'placa.jpg');
    return this.http.post<OcrResponse>(`${this.ocrApi}/reconhecer`, form);
  }

  registrarEntrada(placa: string, foto?: Blob): Observable<RegistroAcesso> {
    const form = new FormData();
    form.append('placa', placa);
    if (foto) form.append('foto', foto, 'entrada.jpg');
    return this.http.post<RegistroAcesso>(`${this.api}/entrada`, form);
  }

  registrarSaida(id: number, foto?: Blob): Observable<RegistroAcesso> {
    const form = new FormData();
    if (foto) form.append('foto', foto, 'saida.jpg');
    return this.http.post<RegistroAcesso>(`${this.api}/${id}/saida`, form);
  }
}
