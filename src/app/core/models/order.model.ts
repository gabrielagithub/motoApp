import { User } from './user.model'; // Poderia ser usado para tipar informações do usuário/motorista

export interface Order {
  id: string;
  userId: string; // ID do usuário que solicitou
  driverId?: string; // ID do mototaxista, opcional até ser aceito

  originAddress: string;
  originCoords?: { lat: number, lng: number }; // Opcional, mas útil
  destinationAddress: string;
  destinationCoords?: { lat: number, lng: number }; // Opcional

  type: 'passenger' | 'delivery'; // Corrida de passageiro ou entrega de encomenda
  packageDetails?: string; // Detalhes da encomenda, se type === 'delivery'
  packageWeightKg?: number; // Peso da encomenda, se type === 'delivery' (max 15kg)

  status: 'pending' | 'accepted' | 'inProgress' | 'completed' | 'cancelled' | 'driverAssigned' | 'driverEnRoute' | 'arrivedAtOrigin' | 'arrivedAtDestination';

  price?: number; // Estimativa inicial ou preço final
  estimatedTimeMinutes?: number; // Estimativa de tempo em minutos
  distanceKm?: number; // Distância da rota

  createdAt: Date;
  acceptedAt?: Date;
  startedAt?: Date; // Quando a corrida/entrega realmente começou
  completedAt?: Date;
  cancelledAt?: Date;

  // Poderíamos adicionar informações do usuário e motorista diretamente ou via IDs
  // passenger?: Partial<User>;
  // driver?: Partial<User>;

  // Para avaliação
  ratingByPassenger?: number;
  commentByPassenger?: string;
  ratingByDriver?: number;
  commentByDriver?: string;
}
