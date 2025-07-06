import { Injectable, ElementRef } from '@angular/core';
import * as L from 'leaflet'; // Importa tudo de leaflet como L
// import 'leaflet-routing-machine'; // Para rotas, se formos usar este plugin específico

// Ícones padrão do Leaflet podem não aparecer corretamente sem esta configuração
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: 'assets/marker-icon-2x.png',
//   iconUrl: 'assets/marker-icon.png',
//   shadowUrl: 'assets/marker-shadow.png'
// });
// Por enquanto, vamos tentar sem isso. Se os marcadores não aparecerem, adicionaremos.
// Precisaríamos copiar esses assets para a pasta 'assets' do projeto.

@Injectable({
  providedIn: 'root'
})
export class MapService {
  private map!: L.Map;
  // private routingControl!: L.Routing.Control; // Para o plugin de rotas

  constructor() {
    // Se estivermos usando 'leaflet-routing-machine', pode ser necessário configurar L.Routing.control aqui
    // ou em um método específico.
  }

  initializeMap(mapElement: ElementRef, center: L.LatLngTuple, zoom: number): void {
    if (this.map) {
      this.map.remove(); // Remove mapa existente para evitar duplicação se chamado múltiplas vezes
    }

    this.map = L.map(mapElement.nativeElement, {
      center: center,
      zoom: zoom,
      // Outras opções do mapa se necessário
    });

    // Adicionar a camada de tiles (mapa base) - OpenStreetMap é gratuito
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19, // Zoom máximo suportado pelo tile layer
    }).addTo(this.map);

    // Pequeno ajuste para garantir que o mapa renderize corretamente após a inicialização
    // em alguns cenários (ex: dentro de tabs, dialogs, ou elementos que mudam de tamanho)
    setTimeout(() => {
      this.map.invalidateSize();
    }, 0);
  }

  getMap(): L.Map | undefined {
    return this.map;
  }

  addMarker(latLng: L.LatLngTuple, popupContent?: string): L.Marker {
    if (!this.map) {
      throw new Error('Mapa não inicializado. Chame initializeMap primeiro.');
    }
    const marker = L.marker(latLng).addTo(this.map);
    if (popupContent) {
      marker.bindPopup(popupContent);
    }
    return marker;
  }

  // Exemplo de função para centralizar o mapa em um ponto
  setView(center: L.LatLngTuple, zoom?: number): void {
    if (!this.map) {
      throw new Error('Mapa não inicializado.');
    }
    this.map.setView(center, zoom || this.map.getZoom());
  }

  // Futuras funções:
  // - calculateRoute(startLatLng: L.LatLngTuple, endLatLng: L.LatLngTuple)
  // - displayRoute(routeCoordinates: L.LatLngTuple[])
  // - updateDriverLocation(driverId: string, latLng: L.LatLngTuple)
  // - etc.
}
