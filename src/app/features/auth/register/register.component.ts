import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service'; // Será implementado

// Validador customizado para verificar se as senhas coincidem
function passwordsMatchValidator(form: FormGroup) {
  const password = form.get('password');
  const confirmPassword = form.get('confirmPassword');
  if (password && confirmPassword && password.value !== confirmPassword.value) {
    confirmPassword.setErrors({ passwordsMismatch: true });
  } else {
    if (confirmPassword) { // Verifica se confirmPassword não é nulo antes de limpar erros
        confirmPassword.setErrors(null);
    }
  }
  return null;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule
  ],
  template: `
    <div class="register-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Cadastro</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline">
              <mat-label>Nome Completo</mat-label>
              <input matInput formControlName="fullName" placeholder="Seu nome completo">
              <mat-error *ngIf="registerForm.get('fullName')?.hasError('required')">
                Nome é obrigatório.
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Email</mat-label>
              <input matInput formControlName="email" type="email" placeholder="seuemail@exemplo.com">
              <mat-error *ngIf="registerForm.get('email')?.hasError('required')">
                Email é obrigatório.
              </mat-error>
              <mat-error *ngIf="registerForm.get('email')?.hasError('email')">
                Formato de email inválido.
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Número de Telefone</mat-label>
              <input matInput formControlName="phoneNumber" placeholder="(XX) XXXXX-XXXX">
               <mat-error *ngIf="registerForm.get('phoneNumber')?.hasError('required')">
                Número de telefone é obrigatório.
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Tipo de Usuário</mat-label>
              <mat-select formControlName="role">
                <mat-option value="passenger">Passageiro</mat-option>
                <mat-option value="driver">Mototaxista</mat-option>
              </mat-select>
              <mat-error *ngIf="registerForm.get('role')?.hasError('required')">
                Tipo de usuário é obrigatório.
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Senha</mat-label>
              <input matInput formControlName="password" type="password" placeholder="Crie uma senha">
              <mat-error *ngIf="registerForm.get('password')?.hasError('required')">
                Senha é obrigatória.
              </mat-error>
              <mat-error *ngIf="registerForm.get('password')?.hasError('minlength')">
                Senha deve ter no mínimo 6 caracteres.
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Confirmar Senha</mat-label>
              <input matInput formControlName="confirmPassword" type="password" placeholder="Confirme sua senha">
              <mat-error *ngIf="registerForm.get('confirmPassword')?.hasError('required')">
                Confirmação de senha é obrigatória.
              </mat-error>
              <mat-error *ngIf="registerForm.get('confirmPassword')?.hasError('passwordsMismatch')">
                As senhas não coincidem.
              </mat-error>
            </mat-form-field>

            <button mat-raised-button color="primary" type="submit" [disabled]="registerForm.invalid">
              Cadastrar
            </button>
          </form>
        </mat-card-content>
        <mat-card-actions>
          <a routerLink="/login">Já tem uma conta? Faça login</a>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .register-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background-color: #f5f5f5;
      padding: 20px 0; // Adiciona padding para rolagem em telas menores
    }
    mat-card {
      max-width: 450px;
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
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  registerForm: FormGroup = this.fb.group({
    fullName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    phoneNumber: ['', [Validators.required]],
    role: ['passenger', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]]
  }, { validators: passwordsMatchValidator });

  onSubmit(): void {
    if (this.registerForm.valid) {
      console.log('Register form data:', this.registerForm.value);
      // Remover confirmPassword antes de enviar para o serviço
      const { confirmPassword, ...userData } = this.registerForm.value;
      // Lógica de registro com o AuthService (mockado por enquanto)
      // this.authService.register(userData).subscribe({
      //   next: () => this.router.navigate(['/login']), // Redirecionar para login após registro
      //   error: (err) => console.error('Registration failed', err) // Tratar erro
      // });
      alert('Cadastro simulado com sucesso! (Ver console para dados)');
    }
  }
}
