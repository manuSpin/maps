import { Component } from '@angular/core';
import { MapsService, PlacesService } from '../../services';
import { Place } from '../../interfaces/places';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrl: './search-results.component.css'
})
export class SearchResultsComponent {

  public selectedId: string = '';

  constructor(private placesService: PlacesService,
    private mapService: MapsService
  ) { }

  public get isLoadingPlaces(): boolean {
    return this.placesService.isLoadingPlaces;
  }

  public get places(): Place[] {
    return this.placesService.places;
  }

  public isSelected(place: Place): boolean{
    return this.selectedId === place.id;
  }

  public flyTo(place: Place): void {
    this.selectedId = place.id;
    const [lng, lat] = place.center;

    this.mapService.flyTo([lng, lat]);
  }

  public getRouteTo(place: Place): void {
    if (!this.placesService.userLocation) {
      throw Error ('No hay ubicación definida para poder calcular una ruta');
    }

    const start = this.placesService.userLocation!;
    const end = place.center as [number, number];

    this.mapService.getRouteBetweenPoints(start, end);

    this.placesService.deletePlaces();
  }



}
