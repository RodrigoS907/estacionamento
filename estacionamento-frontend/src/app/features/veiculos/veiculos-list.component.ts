import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { VeiculoService } from '../../core/services/veiculo.service';
import { Veiculo } from '../../core/models/veiculo.model';

@Component({
  selector: 'app-veiculos-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="page">
      <header class="page-head">
        <h1>Veículos</h1>
        <a class="btn-primary" routerLink="/veiculos/novo">+ Novo veículo</a>
      </header>

      <div class="table-card">
        <table>
          <thead>
            <tr>
              <th>Placa</th>
              <th>Modelo</th>
              <th>Cor</th>
              <th>Tipo</th>
              <th>Mensalista</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let v of veiculos()">
              <td><strong>{{ v.placa }}</strong></td>
              <td>{{ (v.marca || '') + ' ' + (v.modelo || '') }}</td>
              <td>{{ v.cor }}</td>
              <td>{{ v.tipo }}</td>
              <td>
                <span class="badge" [class.badge-ok]="v.mensalista">
                  {{ v.mensalista ? v.mensalistaNome : '—' }}
                </span>
              </td>
              <td class="acoes">
                <button (click)="editar(v.id)">Editar</button>
                <button class="danger" (click)="excluir(v)">Excluir</button>
              </td>
            </tr>
            <tr *ngIf="veiculos().length === 0">
              <td colspan="6" class="empty">Nenhum veículo cadastrado.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .page { max-width: 1200px; margin: 0 auto; }
    .page-head {
      display: flex; justify-content: space-between; align-items: center;
      margin-bottom: 20px;
    }
    h1 { margin: 0; color: #f1f5f9; }
    .btn-primary {
      background: #6366f1; color: white; padding: 10px 16px;
      border-radius: 8px; text-decoration: none; font-weight: 500;
    }
    .table-card {
      background: #1e293b; border-radius: 12px; overflow: hidden;
      border: 1px solid #334155;
    }
    table { width: 100%; border-collapse: collapse; }
    th, td { padding: 12px 16px; text-align: left; border-bottom: 1px solid #334155; }
    th { background: #0f172a; color: #94a3b8; font-size: 12px; text-transform: uppercase; }
    tr:last-child td { border-bottom: none; }
    .badge {
      background: #334155; padding: 4px 10px; border-radius: 999px;
      font-size: 12px;
    }
    .badge-ok { background: #064e3b; color: #6ee7b7; }
    .acoes { display: flex; gap: 8px; }
    .acoes button {
      background: #334155; color: #e2e8f0; border: none;
      padding: 6px 12px; border-radius: 6px; font-size: 13px;
    }
    .acoes button.danger { background: #7f1d1d; color: #fecaca; }
    .empty { text-align: center; color: #94a3b8; padding: 40px; }
  `]
})
export class VeiculosListComponent implements OnInit {
  private service = inject(VeiculoService);
  private router = inject(Router);

  readonly veiculos = signal<Veiculo[]>([]);

  ngOnInit() {
    this.carregar();
  }

  carregar() {
    this.service.listar().subscribe(list => this.veiculos.set(list));
  }

  editar(id: number) {
    this.router.navigate(['/veiculos', id]);
  }

  excluir(v: Veiculo) {
    if (!confirm(`Excluir veículo ${v.placa}?`)) return;
    this.service.excluir(v.id).subscribe(() => this.carregar());
  }
}
