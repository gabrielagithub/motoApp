import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ToolbarComponent } from '../../../shared/components/toolbar/toolbar.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatSidenavModule,
    ToolbarComponent
  ],
  template: `
    <mat-sidenav-container class="sidenav-container">
      <!-- Sidenav (Menu Lateral) - Opcional, pode ser adicionado depois -->
      <!--
      <mat-sidenav #sidenav mode="side" [opened]="authService.isAuthenticated() && showSidenav" class="sidenav">
        <p>Menu Lateral</p>
        <ul>
          <li><a routerLink="/home">Mapa</a></li>
          <li><a routerLink="/history">Histórico</a></li>
        </ul>
      </mat-sidenav>
      -->

      <mat-sidenav-content class="sidenav-content">
        <app-toolbar (toggleSidenav)="toggleSidenavHandler()"></app-toolbar>
        <main class="main-content">
          <router-outlet></router-outlet>
        </main>
        <!-- Footer pode ser adicionado aqui se necessário -->
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    .sidenav-container {
      height: 100vh;
      width: 100%;
    }
    .sidenav {
      width: 250px; // Largura do menu lateral
      // background-color: #f0f0f0;
    }
    .sidenav-content {
      display: flex;
      flex-direction: column;
      height: 100%;
    }
    .main-content {
      flex-grow: 1;
      // padding: 16px; // Espaçamento interno para o conteúdo principal
      overflow-y: auto; // Permite rolagem se o conteúdo for maior que a tela
      height: calc(100% - 64px); // Altura do toolbar (64px para desktop)
    }

    // Ajuste para telas menores onde o toolbar pode ser menor (56px)
    @media (max-width: 599px) {
      .main-content {
        height: calc(100% - 56px);
      }
    }
  `]
})
export class MainLayoutComponent {
  authService = inject(AuthService);
  showSidenav = true; // Exemplo, pode ser controlado por um serviço ou preferência

  constructor() {
    // Se o sidenav for usado, podemos querer controlar sua abertura/fechamento
    // com base no estado de autenticação ou outras lógicas.
  }

  toggleSidenavHandler(): void {
    // Lógica para abrir/fechar o sidenav, se ele for implementado
    // Por exemplo, se 'sidenav' for um ViewChild:
    // this.sidenav.toggle();
    console.log('Toggle Sidenav Clicado no Layout');
    // this.showSidenav = !this.showSidenav; // Simples toggle para a propriedade [opened]
  }
}
