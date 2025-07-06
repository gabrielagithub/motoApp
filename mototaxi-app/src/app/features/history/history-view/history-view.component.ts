import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Observable } from 'rxjs';
import { Order } from '../../../core/models/order.model';
import { HistoryService } from '../../../core/services/history.service';
import { AuthService } from '../../../core/services/auth.service';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'; // Para indicar carregamento

@Component({
  selector: 'app-history-view',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe, // Para formatar datas
    MatListModule,
    MatIconModule,
    MatDividerModule,
    MatCardModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="history-container">
      <mat-card>
        <mat-card-title>Histórico de Corridas/Entregas</mat-card-title>
        <mat-card-content>
          <ng-container *ngIf="isLoading; else historyLoaded">
            <div class="loading-spinner">
              <mat-spinner diameter="50"></mat-spinner>
            </div>
          </ng-container>

          <ng-template #historyLoaded>
            <ng-container *ngIf="orders$ | async as orders; else noHistory">
              <div *ngIf="orders.length > 0; else noHistory">
                <mat-list>
                  <ng-container *ngFor="let order of orders; let last = last">
                    <mat-list-item>
                      <mat-icon matListItemIcon>{{ order.type === 'passenger' ? 'directions_car' : 'local_shipping' }}</mat-icon>
                      <div matListItemTitle>
                        De: {{ order.originAddress }} <br> Para: {{ order.destinationAddress }}
                      </div>
                      <div matListItemLine>
                        Status: {{ getStatusText(order.status) }} | Preço: {{ order.price | currency:'BRL' }}
                      </div>
                      <div matListItemLine>
                        Data: {{ order.createdAt | date:'dd/MM/yyyy HH:mm' }}
                      </div>
                      <!-- Adicionar mais detalhes se necessário -->
                    </mat-list-item>
                    <mat-divider *ngIf="!last"></mat-divider>
                  </ng-container>
                </mat-list>
              </div>
            </ng-container>
          </ng-template>

          <ng-template #noHistory>
            <p class="no-history-message">Nenhum histórico de pedidos encontrado.</p>
          </ng-template>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .history-container {
      padding: 20px;
      max-width: 800px;
      margin: auto;
    }
    mat-card-title {
      margin-bottom: 20px;
    }
    .loading-spinner {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 200px;
    }
    .no-history-message {
      text-align: center;
      font-style: italic;
      margin-top: 20px;
    }
    mat-list-item {
      height: auto !important; /* Para acomodar múltiplas linhas */
      padding-top: 10px;
      padding-bottom: 10px;
    }
    .mat-divider-horizontal {
        margin-left: 16px;
        margin-right: 16px;
    }
  `]
})
export class HistoryViewComponent implements OnInit {
  private historyService = inject(HistoryService);
  // private authService = inject(AuthService); // Se precisar do usuário aqui diretamente

  orders$!: Observable<Order[]>;
  isLoading = true;

  ngOnInit(): void {
    this.orders$ = this.historyService.getOrderHistory();
    this.orders$.subscribe({
      next: () => this.isLoading = false,
      error: () => this.isLoading = false
    });
  }

  getStatusText(status: Order['status']): string {
    const statusMap: { [key in Order['status']]: string } = {
      pending: 'Pendente',
      accepted: 'Aceita',
      driverAssigned: 'Motorista a caminho (origem)',
      driverEnRoute: 'Motorista a caminho (origem)', // Sinônimo
      arrivedAtOrigin: 'Motorista no local de partida',
      inProgress: 'Em Andamento',
      arrivedAtDestination: 'Motorista no destino',
      completed: 'Concluída',
      cancelled: 'Cancelada'
    };
    return statusMap[status] || status;
  }
}
