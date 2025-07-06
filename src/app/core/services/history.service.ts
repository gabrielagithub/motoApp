import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Order } from '../models/order.model';
import { AuthService } from './auth.service'; // Para simular histórico por usuário

@Injectable({
  providedIn: 'root'
})
export class HistoryService {
  private authService = inject(AuthService);

  private mockOrders: Order[] = [
    {
      id: 'order1',
      userId: 'mock-user-id-passenger1', // ID de um usuário passageiro
      driverId: 'mock-user-id-driver1',  // ID de um mototaxista
      originAddress: 'Rua das Palmeiras, 123, São Paulo, SP',
      destinationAddress: 'Avenida Paulista, 1000, São Paulo, SP',
      type: 'passenger',
      status: 'completed',
      price: 25.50,
      estimatedTimeMinutes: 20,
      distanceKm: 5.2,
      createdAt: new Date(2024, 0, 15, 10, 30), // Mês é 0-indexed
      acceptedAt: new Date(2024, 0, 15, 10, 32),
      startedAt: new Date(2024, 0, 15, 10, 35),
      completedAt: new Date(2024, 0, 15, 10, 55),
      ratingByPassenger: 5,
      commentByPassenger: 'Ótima corrida!',
    },
    {
      id: 'order2',
      userId: 'mock-user-id-passenger2',
      driverId: 'mock-user-id-driver1',
      originAddress: 'Rua Augusta, 500, São Paulo, SP',
      destinationAddress: 'Parque Ibirapuera, Portão 3, São Paulo, SP',
      type: 'delivery',
      packageDetails: 'Documentos importantes',
      packageWeightKg: 0.5,
      status: 'completed',
      price: 18.00,
      estimatedTimeMinutes: 15,
      distanceKm: 3.8,
      createdAt: new Date(2024, 1, 20, 14, 0),
      completedAt: new Date(2024, 1, 20, 14, 20),
      ratingByPassenger: 4,
    },
    {
      id: 'order3',
      userId: 'mock-user-id-passenger1', // Mesmo usuário da order1
      driverId: 'mock-user-id-driver2',
      originAddress: 'Shopping Morumbi, São Paulo, SP',
      destinationAddress: 'Aeroporto de Congonhas, São Paulo, SP',
      type: 'passenger',
      status: 'cancelled',
      price: 30.00,
      createdAt: new Date(2024, 2, 10, 8, 0),
      cancelledAt: new Date(2024, 2, 10, 8, 5),
    },
    {
      id: 'order4',
      userId: 'mock-user-id-driver1', // Para simular histórico do motorista
      originAddress: 'Rua Fictícia, 10',
      destinationAddress: 'Avenida Teste, 20',
      type: 'passenger',
      status: 'completed',
      price: 15.00,
      createdAt: new Date(2024, 2, 11, 10, 0),
      completedAt: new Date(2024, 2, 11, 10, 20),
    }
  ];

  constructor() { }

  // Retorna o histórico de pedidos para o usuário logado (seja passageiro ou motorista)
  getOrderHistory(): Observable<Order[]> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      return of([]); // Nenhum usuário logado, retorna histórico vazio
    }

    let userHistory: Order[];
    if (currentUser.role === 'driver') {
      // Se for motorista, retorna pedidos onde ele é o driverId
      userHistory = this.mockOrders.filter(order => order.driverId === currentUser.id);
    } else {
      // Se for passageiro (ou admin, no futuro), retorna pedidos onde ele é o userId
      userHistory = this.mockOrders.filter(order => order.userId === currentUser.id);
    }

    // Simula uma chamada de API com delay
    return of(userHistory).pipe(delay(500));
  }

  // Futuramente, poderia ter métodos para buscar um pedido específico, etc.
  // getOrderById(orderId: string): Observable<Order | undefined> {
  //   const order = this.mockOrders.find(o => o.id === orderId);
  //   return of(order).pipe(delay(300));
  // }
}
