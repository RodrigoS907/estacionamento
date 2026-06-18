import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { VeiculoService } from '../../core/services/veiculo.service';
import { MensalistaService } from '../../core/services/mensalista.service';
import { Mensalista } from '../../core/models/mensalista.model';
import { TipoVeiculo } from '../../core/models/veiculo.model';

@Component({
  selector: 'app-veiculos-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="page">
      <a routerLink="/veiculos" class="voltar">← Voltar</a>
      <h1>{{ editId() ? 'Editar veículo' : 'Novo veículo' }}</h1>

      <form [formGroup]="form" (ngSubmit)="salvar()" class="card">
        <div class="row">
          <label>
            Placa
            <input formControlName="placa" placeholder="ABC1D23">
          </label>
          <label>
            Tipo
            <select formControlName="tipo">
              <option *ngFor="let t of tipos" [value]="t">{{ t }}</option>
            </select>
          </label>
        </div>

        <div class="row">
          <label>
            Marca
            <input formControlName="marca">
          </label>
          <label>
            Modelo
            <input formControlName="modelo">
          </label>
        </div>

        <div class="row">
          <label>
            Cor
            <input formControlName="cor">
          </label>
          <label>
            Mensalista (opcional)
            <select formControlName="mensalistaId">
              <option [ngValue]="null">— Nenhum —</option>
              <option *ngFor="let m of mensalistas()" [ngValue]="m.id">{{ m.nome }}</option>
            </select>
          </label>
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
    input, select {
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
export class VeiculosFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private veiculoService = inject(VeiculoService);
  private mensalistaService = inject(MensalistaService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  readonly tipos: TipoVeiculo[] = ['CARRO', 'MOTO', 'CAMINHONETE', 'OUTRO'];
  readonly mensalistas = signal<Mensalista[]>([]);
  readonly editId = signal<number | null>(null);
  readonly erro = signal<string | null>(null);

  readonly form = this.fb.group({
    placa: ['', Validators.required],
    marca: [''],
    modelo: [''],
    cor: [''],
    tipo: ['CARRO' as TipoVeiculo, Validators.required],
    mensalistaId: [null as number | null]
  });

  ngOnInit() {
    this.mensalistaService.listar().subscribe(list => this.mensalistas.set(list));
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const idNum = Number(id);
      this.editId.set(idNum);
      this.veiculoService.buscar(idNum).subscribe(v => {
        this.form.patchValue({
          placa: v.placa,
          marca: v.marca ?? '',
          modelo: v.modelo ?? '',
          cor: v.cor ?? '',
          tipo: v.tipo,
          mensalistaId: v.mensalistaId ?? null
        });
      });
    }
  }

  salvar() {
    if (this.form.invalid) return;
    const valor = this.form.getRawValue() as any;
    const obs = this.editId()
      ? this.veiculoService.atualizar(this.editId()!, valor)
      : this.veiculoService.criar(valor);
    obs.subscribe({
      next: () => this.router.navigate(['/veiculos']),
      error: (err) => this.erro.set(err?.error?.mensagem ?? 'Erro ao salvar')
    });
  }
}
