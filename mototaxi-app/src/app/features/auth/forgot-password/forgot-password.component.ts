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
  selector: 'app-forgot-password',
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
    <div class="forgot-password-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Recuperar Senha</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <p>Insira seu email para enviarmos instruções de como redefinir sua senha.</p>
          <form [formGroup]="forgotPasswordForm" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline">
              <mat-label>Email</mat-label>
              <input matInput formControlName="email" type="email" placeholder="seuemail@exemplo.com">
              <mat-error *ngIf="forgotPasswordForm.get('email')?.hasError('required')">
                Email é obrigatório.
              </mat-error>
              <mat-error *ngIf="forgotPasswordForm.get('email')?.hasError('email')">
                Formato de email inválido.
              </mat-error>
            </mat-form-field>

            <button mat-raised-button color="primary" type="submit" [disabled]="forgotPasswordForm.invalid">
              Enviar Email de Recuperação
            </button>
          </form>
        </mat-card-content>
        <mat-card-actions>
          <a routerLink="/login">Voltar para Login</a>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .forgot-password-container {
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
      justify-content: center;
      margin-top: 10px;
    }
    mat-card-actions a {
      text-decoration: none;
      color: #3f51b5;
    }
    mat-card-actions a:hover {
      text-decoration: underline;
    }
  `]
})
export class ForgotPasswordComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService); // Usaremos para a lógica de recuperação
  private router = inject(Router);

  forgotPasswordForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

  onSubmit(): void {
    if (this.forgotPasswordForm.valid) {
      console.log('Forgot password form data:', this.forgotPasswordForm.value);
      // Lógica de recuperação com o AuthService (mockado por enquanto)
      // this.authService.forgotPassword(this.forgotPasswordForm.value.email).subscribe({
      //   next: () => alert('Email de recuperação enviado! Verifique sua caixa de entrada.'),
      //   error: (err) => console.error('Forgot password failed', err)
      // });
      alert('Email de recuperação simulado enviado para: ' + this.forgotPasswordForm.value.email);
    }
  }
}
