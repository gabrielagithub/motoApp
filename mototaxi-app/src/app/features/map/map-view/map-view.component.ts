import { Component, OnInit, OnDestroy, ElementRef, ViewChild, inject, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapService } from '../../../core/services/map.service';
import * as L from 'leaflet'; // Necessário para LatLngTuple e outros tipos Leaflet

@Component({
  selector: 'app-map-view',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="map-container">
      <div #mapElement class="map-frame"></div>
      <!-- Outros elementos da UI sobre o mapa podem ser adicionados aqui -->
    </div>
  `,
  styles: [`
    .map-container {
      width: 100%;
      height: 100vh; /* Altura total da viewport, ajuste conforme necessário */
      position: relative;
    }
    .map-frame {
      width: 100%;
      height: 100%;
    }
    /* Estilos para garantir que o mapa ocupe o espaço corretamente */
    :host {
      display: block;
      width: 100%;
      height: 100%; // Ou ajuste conforme o layout pai
    }
  `]
})
export class MapViewComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('mapElement', { static: true }) mapElementRef!: ElementRef;

  private mapService = inject(MapService);

  // Coordenadas de exemplo (São Paulo)
  private initialCenter: L.LatLngTuple = [-23.55052, -46.633308];
  private initialZoom = 13;

  constructor() {}

  ngOnInit(): void {
    // A inicialização do mapa que manipula o DOM deve ocorrer em AfterViewInit
  }

  ngAfterViewInit(): void {
    if (this.mapElementRef) {
      this.mapService.initializeMap(this.mapElementRef, this.initialCenter, this.initialZoom);

      // Exemplo de como adicionar um marcador
      this.mapService.addMarker(this.initialCenter, 'Centro de São Paulo');

      // Exemplo: Adicionar um marcador para a localização do usuário (se disponível)
      this.tryToLocateUser();

    } else {
      console.error('Elemento do mapa não encontrado!');
    }
  }

  private tryToLocateUser(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLatLng: L.LatLngTuple = [position.coords.latitude, position.coords.longitude];
          this.mapService.setView(userLatLng, 15);
          this.mapService.addMarker(userLatLng, 'Sua Localização');
        },
        (error) => {
          console.warn('Não foi possível obter a localização do usuário:', error.message);
          // Opcional: informar ao usuário que a localização não pôde ser obtida
        }
      );
    } else {
      console.warn('Geolocalização não é suportada por este navegador.');
    }
  }

  ngOnDestroy(): void {
    // Limpeza do mapa pode ser necessária se o serviço não fizer isso
    // ou se houver listeners específicos do componente no mapa.
    // O MapService já tem uma lógica de this.map.remove() na inicialização,
    // o que pode ser suficiente para muitos casos.
    const map = this.mapService.getMap();
    if (map) {
      // map.remove(); // Descomente se a remoção for necessária aqui.
    }
  }
}
