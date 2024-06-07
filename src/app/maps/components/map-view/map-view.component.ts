import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { MapsService, PlacesService } from '../../services';
import { Map, Popup, Marker } from 'mapbox-gl';

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrl: './map-view.component.css'
})
export class MapViewComponent implements AfterViewInit {

  @ViewChild('mapDiv') public mapDiv!: ElementRef;

  constructor(private placesService: PlacesService,
    private mapService: MapsService) { }

  ngAfterViewInit(): void {
    if (!this.placesService.userLocation) {
      throw Error('No hay ubicación');
    }

    // if (!this.placesService.userLocation) {
    //   throw Error('No hay placesService.userLocation');
    // }

    const map = new Map({
      container: this.mapDiv.nativeElement,
      style: 'mapbox://styles/mapbox/outdoors-v12',
      center: this.placesService.userLocation,
      zoom: 14,
    });


    const popup = new Popup().setHTML(`
      <h6>Aquí estoy</h6>
      <span>Estoy en este lugar</span>
    `);

    const marker = new Marker({ color: 'red' }).setLngLat(this.placesService.userLocation).setPopup(popup).addTo(map);

    this.mapService.setMap(map);
  }

}
