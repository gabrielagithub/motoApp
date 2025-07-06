import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service'; // Será implementado

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  template: `
    <div class="login-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Login</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline">
              <mat-label>Email</mat-label>
              <input matInput formControlName="email" type="email" placeholder="seuemail@exemplo.com">
              <mat-error *ngIf="loginForm.get('email')?.hasError('required')">
                Email é obrigatório.
              </mat-error>
              <mat-error *ngIf="loginForm.get('email')?.hasError('email')">
                Formato de email inválido.
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Senha</mat-label>
              <input matInput formControlName="password" type="password" placeholder="Sua senha">
              <mat-error *ngIf="loginForm.get('password')?.hasError('required')">
                Senha é obrigatória.
              </mat-error>
            </mat-form-field>

            <button mat-raised-button color="primary" type="submit" [disabled]="loginForm.invalid">
              Entrar
            </button>
          </form>
        </mat-card-content>
        <mat-card-actions>
          <a routerLink="/register">Não tem uma conta? Cadastre-se</a>
          <br>
          <a routerLink="/forgot-password">Esqueceu a senha?</a>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      background-color: #f5f5f5;
    }
    mat-card {
      max-width: 400px;
      width: 100%;
      padding: 20px;
    }
    mat-form-field {
      width: 100%;
      margin-bottom: 16px;
    }
    button[type="submit"] {
      width: 100%;
    }
    mat-card-actions {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-top: 10px;
    }
    mat-card-actions a {
      text-decoration: none;
      color: #3f51b5; /* Cor primária do Angular Material */
      margin-top: 8px;
    }
    mat-card-actions a:hover {
      text-decoration: underline;
    }
  `]
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  onSubmit(): void {
    if (this.loginForm.valid) {
      console.log('Login form data:', this.loginForm.value);
      // Lógica de login com o AuthService (mockado por enquanto)
      // this.authService.login(this.loginForm.value).subscribe({
      //   next: () => this.router.navigate(['/dashboard']), // Redirecionar para dashboard após login
      //   error: (err) => console.error('Login failed', err) // Tratar erro de login
      // });
      alert('Login simulado com sucesso! (Ver console para dados)');
      // Por enquanto, vamos apenas navegar para uma rota fictícia de dashboard
      // this.router.navigate(['/']); // Idealmente para um dashboard
    }
  }
}
