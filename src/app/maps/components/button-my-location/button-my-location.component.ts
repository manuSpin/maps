import { Component } from '@angular/core';
import { MapsService, PlacesService } from '../../services';

@Component({
  selector: 'app-button-my-location',
  templateUrl: './button-my-location.component.html',
  styleUrl: './button-my-location.component.css'
})
export class ButtonMyLocationComponent {

  constructor(private placesService: PlacesService,
    private mapService: MapsService) { }

  public gotToMyLocation() {
    if (!this.placesService.isUserLocationReady) {
      throw Error('No hay ubicación definida');
    }

    if (!this.mapService.isMapReady) {
      throw Error('No hay un mapa definido');
    }
    this.mapService.flyTo(this.placesService.userLocation!);

  }

}
