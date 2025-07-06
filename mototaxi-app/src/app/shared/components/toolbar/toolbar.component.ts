import { Component, inject, computed, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule
  ],
  template: `
    <mat-toolbar color="primary">
      <button mat-icon-button (click)="toggleSidenav.emit()" aria-label="Toggle Sidenav">
        <mat-icon>menu</mat-icon>
      </button>
      <span>Mototaxi App</span>
      <span class="spacer"></span>

      <ng-container *ngIf="authService.isAuthenticated(); else loggedOutActions">
        <button mat-button [matMenuTriggerFor]="userMenu">
          <mat-icon>account_circle</mat-icon>
          <span *ngIf="currentUser()">{{ currentUser()?.fullName || currentUser()?.email }}</span>
        </button>
        <mat-menu #userMenu="matMenu">
          <button mat-menu-item routerLink="/profile"> <!-- Rota de perfil a ser criada -->
            <mat-icon>person</mat-icon>
            <span>Perfil</span>
          </button>
          <button mat-menu-item (click)="logout()">
            <mat-icon>exit_to_app</mat-icon>
            <span>Sair</span>
          </button>
        </mat-menu>
      </ng-container>

      <ng-template #loggedOutActions>
        <button mat-button routerLink="/login">
          <mat-icon>login</mat-icon>
          <span>Login</span>
        </button>
        <button mat-button routerLink="/register">
          <mat-icon>person_add</mat-icon>
          <span>Cadastro</span>
        </button>
      </ng-template>
    </mat-toolbar>
  `,
  styles: [`
    .spacer {
      flex: 1 1 auto;
    }
    mat-toolbar {
      position: sticky;
      top: 0;
      z-index: 1000; // Para ficar sobre outros elementos
    }
    button[mat-icon-button] {
      margin-right: 8px;
    }
    .mat-menu-item mat-icon {
      margin-right: 8px;
    }
  `]
})
export class ToolbarComponent {
  authService = inject(AuthService);
  private router = inject(Router);

  // Expor o usuário atual como um signal para o template
  currentUser = computed(() => this.authService.getCurrentUser());

  // Output para interagir com o Sidenav no LayoutComponent (se necessário)
  // @Output() toggleSidenav = new EventEmitter<void>();
  // Por enquanto, o botão de menu não fará nada, mas está lá para o layout.
  // Se formos usar um Sidenav, precisaremos de um EventEmitter aqui
  // e lógica no MainLayoutComponent para controlar o Sidenav.

  // Para o botão de menu, precisaremos de um EventEmitter se o Sidenav for controlado pelo LayoutComponent.
  // Vamos adicionar um EventEmitter simples para o toggleSidenav, mesmo que não seja usado imediatamente.
  @Output() toggleSidenav = new EventEmitter<void>();


  logout(): void {
    this.authService.logout();
    // A navegação já é feita pelo authService.logout()
  }
}
