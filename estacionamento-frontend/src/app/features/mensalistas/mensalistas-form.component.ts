import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MensalistaService } from '../../core/services/mensalista.service';
import { CurrencyMaskDirective } from '../../shared/directives/currency-mask.directive';

@Component({
  selector: 'app-mensalistas-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, CurrencyMaskDirective],
  template: `
    <div class="page">
      <a routerLink="/mensalistas" class="voltar">← Voltar</a>
      <h1>{{ editId() ? 'Editar mensalista' : 'Novo mensalista' }}</h1>

      <form [formGroup]="form" (ngSubmit)="salvar()" class="card">
        <div class="row">
          <label>
            Nome
            <input formControlName="nome">
          </label>
          <label>
            CPF/CNPJ
            <input formControlName="cpfCnpj">
          </label>
        </div>
        <div class="row">
          <label>
            Telefone
            <input formControlName="telefone">
          </label>
          <label>
            E-mail
            <input type="email" formControlName="email">
          </label>
        </div>
        <div class="row">
          <label>
            Data de início
            <input type="date" formControlName="dataInicio">
          </label>
          <label>
            Data de vencimento
            <input type="date" formControlName="dataVencimento">
          </label>
        </div>
        <div class="row">
          <label>
            Valor da mensalidade
            <input type="text" inputmode="numeric" appCurrencyMask formControlName="valorMensalidade" placeholder="R$ 0,00">
          </label>
          <span></span>
        </div>

        <button type="submit" [disabled]="form.invalid">
          {{ editId() ? 'Salvar alterações' : 'Cadastrar' }}
        </button>
        <p class="erro" *ngIf="erro()">{{ erro() }}</p>
      </form>
    </div>
  `,
  styles: [`
    .page { max-width: 700px; margin: 0 auto; }
    .voltar { color: #94a3b8; text-decoration: none; font-size: 13px; }
    h1 { margin: 12px 0 24px; color: #f1f5f9; }
    .card { background: #1e293b; padding: 24px; border-radius: 12px; border: 1px solid #334155; }
    .row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; }
    label { display: flex; flex-direction: column; gap: 6px; font-size: 13px; color: #cbd5e1; }
    input {
      background: #0f172a; border: 1px solid #334155; color: #e2e8f0;
      padding: 10px 12px; border-radius: 8px; font-size: 14px;
    }
    button {
      background: #6366f1; color: white; border: none;
      padding: 12px 24px; border-radius: 8px; font-weight: 600; margin-top: 8px;
    }
    button:disabled { opacity: 0.6; }
    .erro { color: #f87171; margin-top: 12px; }
    @media (max-width: 600px) { .row { grid-template-columns: 1fr; } }
  `]
})
export class MensalistasFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private service = inject(MensalistaService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  readonly editId = signal<number | null>(null);
  readonly erro = signal<string | null>(null);

  readonly form = this.fb.group({
    nome: ['', Validators.required],
    cpfCnpj: ['', Validators.required],
    telefone: [''],
    email: [''],
    dataInicio: [''],
    dataVencimento: [''],
    valorMensalidade: [0]
  });

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const idNum = Number(id);
      this.editId.set(idNum);
      this.service.buscar(idNum).subscribe(m => {
        this.form.patchValue({
          nome: m.nome,
          cpfCnpj: m.cpfCnpj,
          telefone: m.telefone ?? '',
          email: m.email ?? '',
          dataInicio: m.dataInicio ?? '',
          dataVencimento: m.dataVencimento ?? '',
          valorMensalidade: m.valorMensalidade ?? 0
        });
      });
    }
  }

  salvar() {
    if (this.form.invalid) return;
    const valor = this.form.getRawValue() as any;
    const obs = this.editId()
      ? this.service.atualizar(this.editId()!, valor)
      : this.service.criar(valor);
    obs.subscribe({
      next: () => this.router.navigate(['/mensalistas']),
      error: (err) => this.erro.set(err?.error?.mensagem ?? 'Erro ao salvar')
    });
  }
}
