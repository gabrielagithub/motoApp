export interface User {
  id: string;
  email: string;
  fullName?: string;
  phoneNumber?: string;
  role: 'passenger' | 'driver' | 'admin'; // Passageiro, Mototaxista, Admin
  // Outros campos conforme necessário
}
