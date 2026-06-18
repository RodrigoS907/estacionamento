import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AcessoService } from '../../core/services/acesso.service';
import { RegistroAcesso } from '../../core/models/registro-acesso.model';
import { CameraCaptureComponent } from '../../shared/components/camera-capture/camera-capture.component';

type Modo = 'lista' | 'entrada' | 'saida';

@Component({
  selector: 'app-portaria',
  standalone: true,
  imports: [CommonModule, FormsModule, CameraCaptureComponent],
  template: `
    <div class="page">
      <header class="page-head">
        <h1>Portaria</h1>
        <div class="actions" *ngIf="modo() === 'lista'">
          <button class="primary" (click)="iniciarEntrada()">+ Registrar entrada</button>
        </div>
        <button *ngIf="modo() !== 'lista'" class="voltar" (click)="voltar()">← Voltar</button>
      </header>

      <!-- LISTA DE ABERTOS -->
      <section *ngIf="modo() === 'lista'">
        <h2>Veículos no estacionamento</h2>
        <div class="grid">
          <div *ngFor="let r of registrosAbertos()" class="reg-card">
            <div class="reg-info">
              <strong class="placa">{{ r.placaDetectada }}</strong>
              <span class="modelo">{{ r.modeloVeiculo || '—' }}</span>
              <small>Entrada: {{ r.dataHoraEntrada | date:'dd/MM HH:mm' }}</small>
              <span *ngIf="r.mensalista" class="badge-ok">Mensalista</span>
            </div>
            <button class="primary" (click)="iniciarSaida(r)">Registrar saída</button>
          </div>
          <div *ngIf="registrosAbertos().length === 0" class="empty">
            Nenhum veículo no estacionamento.
          </div>
        </div>
      </section>

      <!-- ENTRADA -->
      <section *ngIf="modo() === 'entrada'" class="form-card">
        <h2>Registrar entrada</h2>
        <p class="hint">Tire uma foto do veículo. A placa será sugerida automaticamente.</p>

        <app-camera-capture (fotoCapturada)="onFotoEntrada($event)"></app-camera-capture>

        <div *ngIf="fotoEntrada()" class="placa-confirma">
          <label>
            Placa identificada
            <input [(ngModel)]="placaConfirmada" placeholder="ABC1D23">
          </label>
          <small *ngIf="ocrCarregando()" class="hint">Lendo placa...</small>
          <small *ngIf="!ocrCarregando() && placaConfirmada" class="hint">
            Confira e ajuste se necessário.
          </small>
        </div>

        <button *ngIf="fotoEntrada() && placaConfirmada"
                class="primary grande"
                [disabled]="salvando()"
                (click)="confirmarEntrada()">
          {{ salvando() ? 'Salvando...' : 'Confirmar entrada' }}
        </button>

        <p class="erro" *ngIf="erro()">{{ erro() }}</p>
      </section>

      <!-- SAÍDA -->
      <section *ngIf="modo() === 'saida' && registroSelecionado()" class="form-card">
        <h2>Registrar saída — {{ registroSelecionado()?.placaDetectada }}</h2>
        <p class="hint">Tire uma foto do veículo na saída.</p>

        <app-camera-capture (fotoCapturada)="onFotoSaida($event)"></app-camera-capture>

        <button *ngIf="fotoSaida()"
                class="primary grande"
                [disabled]="salvando()"
                (click)="confirmarSaida()">
          {{ salvando() ? 'Calculando...' : 'Confirmar saída' }}
        </button>

        <div *ngIf="registroFinalizado()" class="resultado">
          <h3>Saída registrada</h3>
          <p>Valor a cobrar: <strong>{{ registroFinalizado()?.valorCobrado | currency:'BRL' }}</strong></p>
          <button (click)="voltar()">Voltar para a lista</button>
        </div>

        <p class="erro" *ngIf="erro()">{{ erro() }}</p>
      </section>
    </div>
  `,
  styles: [`
    .page { max-width: 900px; margin: 0 auto; }
    .page-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
    h1 { margin: 0; color: #f1f5f9; }
    h2 { margin: 0 0 16px; color: #cbd5e1; font-size: 18px; }
    h3 { margin: 0 0 8px; color: #f1f5f9; }
    .primary {
      background: #6366f1; color: white; border: none;
      padding: 10px 20px; border-radius: 8px; font-weight: 600; font-size: 14px;
    }
    .primary.grande { width: 100%; padding: 14px; font-size: 16px; margin-top: 16px; }
    .primary:disabled { opacity: 0.6; }
    .voltar {
      background: transparent; color: #94a3b8; border: none;
      padding: 8px 12px; font-size: 14px;
    }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 12px; }
    .reg-card {
      background: #1e293b; padding: 16px; border-radius: 12px;
      border: 1px solid #334155;
      display: flex; flex-direction: column; gap: 12px;
    }
    .reg-info { display: flex; flex-direction: column; gap: 4px; }
    .placa { font-size: 22px; color: #f1f5f9; }
    .modelo { color: #cbd5e1; font-size: 14px; }
    small { color: #94a3b8; }
    .badge-ok {
      background: #064e3b; color: #6ee7b7; padding: 2px 8px;
      border-radius: 999px; font-size: 11px; align-self: flex-start;
    }
    .empty { color: #94a3b8; padding: 40px; text-align: center; grid-column: 1 / -1; }
    .form-card {
      background: #1e293b; padding: 24px; border-radius: 12px;
      border: 1px solid #334155;
    }
    .hint { color: #94a3b8; font-size: 13px; margin: 0 0 16px; }
    .placa-confirma { margin-top: 16px; }
    .placa-confirma label { display: flex; flex-direction: column; gap: 6px; color: #cbd5e1; font-size: 13px; }
    .placa-confirma input {
      background: #0f172a; border: 1px solid #334155; color: #e2e8f0;
      padding: 12px; border-radius: 8px; font-size: 20px;
      text-transform: uppercase; letter-spacing: 0.1em; text-align: center;
    }
    .resultado {
      background: #064e3b; padding: 20px; border-radius: 12px;
      margin-top: 20px; text-align: center;
    }
    .resultado strong { font-size: 24px; color: #6ee7b7; }
    .erro { color: #f87171; margin-top: 12px; }
  `]
})
export class PortariaComponent implements OnInit {
  private acessoService = inject(AcessoService);

  readonly modo = signal<Modo>('lista');
  readonly registrosAbertos = signal<RegistroAcesso[]>([]);
  readonly registroSelecionado = signal<RegistroAcesso | null>(null);
  readonly registroFinalizado = signal<RegistroAcesso | null>(null);
  readonly fotoEntrada = signal<Blob | null>(null);
  readonly fotoSaida = signal<Blob | null>(null);
  readonly ocrCarregando = signal(false);
  readonly salvando = signal(false);
  readonly erro = signal<string | null>(null);

  placaConfirmada = '';

  ngOnInit() { this.carregarAbertos(); }

  carregarAbertos() {
    this.acessoService.listarAbertos().subscribe(list => this.registrosAbertos.set(list));
  }

  iniciarEntrada() {
    this.modo.set('entrada');
    this.fotoEntrada.set(null);
    this.placaConfirmada = '';
    this.erro.set(null);
  }

  iniciarSaida(r: RegistroAcesso) {
    this.registroSelecionado.set(r);
    this.registroFinalizado.set(null);
    this.fotoSaida.set(null);
    this.erro.set(null);
    this.modo.set('saida');
  }

  voltar() {
    this.modo.set('lista');
    this.registroSelecionado.set(null);
    this.registroFinalizado.set(null);
    this.fotoEntrada.set(null);
    this.fotoSaida.set(null);
    this.placaConfirmada = '';
    this.erro.set(null);
    this.carregarAbertos();
  }

  onFotoEntrada(blob: Blob) {
    this.fotoEntrada.set(blob);
    this.ocrCarregando.set(true);
    this.acessoService.reconhecerPlaca(blob).subscribe({
      next: ocr => {
        this.ocrCarregando.set(false);
        this.placaConfirmada = ocr.placa ?? '';
      },
      error: () => {
        this.ocrCarregando.set(false);
        this.placaConfirmada = '';
      }
    });
  }

  onFotoSaida(blob: Blob) {
    this.fotoSaida.set(blob);
  }

  confirmarEntrada() {
    if (!this.placaConfirmada.trim()) return;
    this.salvando.set(true);
    this.erro.set(null);
    this.acessoService.registrarEntrada(this.placaConfirmada.trim().toUpperCase(), this.fotoEntrada()!).subscribe({
      next: () => { this.salvando.set(false); this.voltar(); },
      error: (err) => {
        this.salvando.set(false);
        this.erro.set(err?.error?.mensagem ?? 'Erro ao registrar entrada');
      }
    });
  }

  confirmarSaida() {
    const reg = this.registroSelecionado();
    if (!reg) return;
    this.salvando.set(true);
    this.erro.set(null);
    this.acessoService.registrarSaida(reg.id, this.fotoSaida() ?? undefined).subscribe({
      next: (final) => {
        this.salvando.set(false);
        this.registroFinalizado.set(final);
      },
      error: (err) => {
        this.salvando.set(false);
        this.erro.set(err?.error?.mensagem ?? 'Erro ao registrar saída');
      }
    });
  }
}
