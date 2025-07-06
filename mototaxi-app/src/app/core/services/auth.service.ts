import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of, BehaviorSubject, throwError } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly MOCK_USER_KEY = 'mototaxi_mock_user';
  private readonly JWT_TOKEN_KEY = 'mototaxi_jwt_token';

  private currentUserSignal = signal<User | null>(this.getUserFromLocalStorage());

  // BehaviorSubject para compatibilidade com partes do app que podem usar Observables diretamente
  private currentUserSubject = new BehaviorSubject<User | null>(this.currentUserSignal());
  public currentUser$ = this.currentUserSubject.asObservable();

  // Sinal computado para isAuthenticated, derivado de currentUserSignal
  public isAuthenticated = computed(() => !!this.currentUserSignal());

  constructor(private router: Router) {
    // Sincronizar BehaviorSubject quando o signal mudar (para consumidores de Observable)
    // Isso pode não ser estritamente necessário se migrarmos tudo para signals,
    // mas mantém a compatibilidade.
    // No entanto, a fonte da verdade é o signal.
    // Podemos atualizar o subject quando o signal muda.
    // Effect(() => this.currentUserSubject.next(this.currentUserSignal())); // Requer import de Effect
    // Por simplicidade, vamos atualizar o subject nos métodos que mudam o estado.
  }

  private getUserFromLocalStorage(): User | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      const userJson = localStorage.getItem(this.MOCK_USER_KEY);
      return userJson ? JSON.parse(userJson) : null;
    }
    return null;
  }

  private saveUserToLocalStorage(user: User): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(this.MOCK_USER_KEY, JSON.stringify(user));
      localStorage.setItem(this.JWT_TOKEN_KEY, `mock-jwt-token-for-${user.email}`);
      this.currentUserSignal.set(user);
      this.currentUserSubject.next(user); // Sincroniza o BehaviorSubject
    }
  }

  private removeUserFromLocalStorage(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem(this.MOCK_USER_KEY);
      localStorage.removeItem(this.JWT_TOKEN_KEY);
      this.currentUserSignal.set(null);
      this.currentUserSubject.next(null); // Sincroniza o BehaviorSubject
    }
  }

  login(credentials: { email: string, password?: string }): Observable<User> {
    return new Observable<User>(observer => {
      setTimeout(() => {
        if (credentials.email && credentials.email.includes('@') && credentials.password && credentials.password.length >= 6) {
          const mockUser: User = {
            id: 'mock-user-id-' + new Date().getTime(),
            email: credentials.email,
            fullName: credentials.email.split('@')[0].replace(/[._]/g, ' ').replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()),
            role: credentials.email.toLowerCase().includes('driver@') ? 'driver' : 'passenger',
          };
          this.saveUserToLocalStorage(mockUser);
          observer.next(mockUser);
          observer.complete();
        } else {
          observer.error(new Error('Credenciais inválidas (mock). Email deve ser válido e senha >= 6 caracteres.'));
        }
      }, 1000);
    });
  }

  register(userData: Omit<User, 'id' | 'fullName'> & {fullName?: string}): Observable<User> { // fullName opcional no input
    return new Observable<User>(observer => {
      setTimeout(() => {
        const newUser: User = {
          id: 'mock-user-id-' + new Date().getTime(),
          email: userData.email,
          role: userData.role,
          fullName: userData.fullName || userData.email.split('@')[0], // Usa nome do email se não fornecido
          phoneNumber: userData.phoneNumber
        };
        // Não logamos o usuário automaticamente após o registro neste mock.
        console.log('Mock Service: Usuário registrado (não logado):', newUser);
        observer.next(newUser);
        observer.complete();
      }, 1000);
    });
  }

  logout(): void {
    this.removeUserFromLocalStorage();
    this.router.navigate(['/login']);
  }

  getCurrentUser(): User | null {
    return this.currentUserSignal(); // Lê diretamente do signal
  }

  getJwtToken(): string | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem(this.JWT_TOKEN_KEY);
    }
    return null;
  }

  forgotPassword(email: string): Observable<{ message: string }> {
    return of({ message: `Instruções de recuperação de senha enviadas para ${email} (mock)` }).pipe(delay(1000));
  }
}
