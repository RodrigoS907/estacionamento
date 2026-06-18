import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { MensalistaService } from '../../core/services/mensalista.service';
import { Mensalista } from '../../core/models/mensalista.model';

@Component({
  selector: 'app-mensalistas-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="page">
      <header class="page-head">
        <h1>Mensalistas</h1>
        <a class="btn-primary" routerLink="/mensalistas/novo">+ Novo mensalista</a>
      </header>

      <div class="table-card">
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>CPF/CNPJ</th>
              <th>Vencimento</th>
              <th>Mensalidade</th>
              <th>Veículos</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let m of mensalistas()">
              <td><strong>{{ m.nome }}</strong></td>
              <td>{{ m.cpfCnpj }}</td>
              <td>{{ m.dataVencimento | date:'dd/MM/yyyy' }}</td>
              <td>{{ m.valorMensalidade | currency:'BRL' }}</td>
              <td>
                <span *ngFor="let p of m.placasVeiculos" class="pill">{{ p }}</span>
                <span *ngIf="m.placasVeiculos.length === 0" class="muted">—</span>
              </td>
              <td>
                <span class="badge" [class.badge-ok]="m.ativo" [class.badge-off]="!m.ativo">
                  {{ m.ativo ? 'Ativo' : 'Inativo' }}
                </span>
              </td>
              <td class="acoes">
                <button (click)="editar(m.id)">Editar</button>
                <button class="danger" *ngIf="m.ativo" (click)="inativar(m)">Inativar</button>
              </td>
            </tr>
            <tr *ngIf="mensalistas().length === 0">
              <td colspan="7" class="empty">Nenhum mensalista cadastrado.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .page { max-width: 1200px; margin: 0 auto; }
    .page-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
    h1 { margin: 0; color: #f1f5f9; }
    .btn-primary {
      background: #6366f1; color: white; padding: 10px 16px;
      border-radius: 8px; text-decoration: none; font-weight: 500;
    }
    .table-card { background: #1e293b; border-radius: 12px; overflow: hidden; border: 1px solid #334155; }
    table { width: 100%; border-collapse: collapse; }
    th, td { padding: 12px 16px; text-align: left; border-bottom: 1px solid #334155; }
    th { background: #0f172a; color: #94a3b8; font-size: 12px; text-transform: uppercase; }
    tr:last-child td { border-bottom: none; }
    .badge { padding: 4px 10px; border-radius: 999px; font-size: 12px; }
    .badge-ok { background: #064e3b; color: #6ee7b7; }
    .badge-off { background: #450a0a; color: #fecaca; }
    .pill {
      display: inline-block; background: #334155; padding: 2px 8px;
      border-radius: 4px; font-size: 12px; margin-right: 4px;
    }
    .muted { color: #94a3b8; }
    .acoes { display: flex; gap: 8px; }
    .acoes button {
      background: #334155; color: #e2e8f0; border: none;
      padding: 6px 12px; border-radius: 6px; font-size: 13px;
    }
    .acoes button.danger { background: #7f1d1d; color: #fecaca; }
    .empty { text-align: center; color: #94a3b8; padding: 40px; }
  `]
})
export class MensalistasListComponent implements OnInit {
  private service = inject(MensalistaService);
  private router = inject(Router);

  readonly mensalistas = signal<Mensalista[]>([]);

  ngOnInit() { this.carregar(); }

  carregar() {
    this.service.listar().subscribe(list => this.mensalistas.set(list));
  }

  editar(id: number) {
    this.router.navigate(['/mensalistas', id]);
  }

  inativar(m: Mensalista) {
    if (!confirm(`Inativar mensalista ${m.nome}?`)) return;
    this.service.inativar(m.id).subscribe(() => this.carregar());
  }
}
