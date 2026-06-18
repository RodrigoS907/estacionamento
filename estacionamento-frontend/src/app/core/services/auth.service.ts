import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginRequest, LoginResponse } from '../models/auth.model';
import { UsuarioLogado } from '../models/usuario.model';

const STORAGE_TOKEN = 'estacionamento_token';
const STORAGE_USER  = 'estacionamento_usuario';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = `${environment.apiUrl}/auth`;
  readonly usuarioAtual = signal<UsuarioLogado | null>(this.carregarUsuario());
  readonly autenticado = computed(() => this.usuarioAtual() !== null);
  readonly ehAdmin = computed(() => this.usuarioAtual()?.papel === 'ADMIN');

  constructor(private http: HttpClient) {}

  login(req: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.api}/login`, req).pipe(
      tap(resp => {
        localStorage.setItem(STORAGE_TOKEN, resp.token);
        const usuario: UsuarioLogado = { nome: resp.nome, email: resp.email, papel: resp.papel };
        localStorage.setItem(STORAGE_USER, JSON.stringify(usuario));
        this.usuarioAtual.set(usuario);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(STORAGE_TOKEN);
    localStorage.removeItem(STORAGE_USER);
    this.usuarioAtual.set(null);
  }

  obterToken(): string | null {
    return localStorage.getItem(STORAGE_TOKEN);
  }

  estaAutenticado(): boolean {
    return this.obterToken() !== null;
  }

  private carregarUsuario(): UsuarioLogado | null {
    const json = localStorage.getItem(STORAGE_USER);
    if (!json) return null;
    try { return JSON.parse(json) as UsuarioLogado; }
    catch { return null; }
  }
}
