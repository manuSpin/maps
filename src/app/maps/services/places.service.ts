import { Injectable } from '@angular/core';
import { Place, PlacesResponse } from '../interfaces/places';
import { PlacesApiClient } from '../api';
import { MapsService } from './maps.service';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {

  public userLocation?: [number, number];
  public isLoadingPlaces: boolean = false;
  public places: Place[] = [];

  constructor(private placesApi: PlacesApiClient,
    private mapService: MapsService
  ) {
    this.getUserLocation();
  }

  public get isUserLocationReady(): boolean {
    return !!this.userLocation;
  }

  public async getUserLocation(): Promise<[number, number]> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(({ coords }) => {
        this.userLocation = [coords.longitude, coords.latitude];
        resolve(this.userLocation);
      },
        (error) => {
          alert('No se pudo obtener la geolocalización');
          console.error(error);
          reject();
        });
    });
  }

  public getPlacesByQuery(query: string = '') {
    if (query.length !== 0) {
      if (!this.userLocation) {
        throw Error('No hay ubicación definida');
      }

      this.isLoadingPlaces = true;

      const params = { params: { proximity: this.userLocation.join(',') } };

      this.placesApi.get<PlacesResponse>(query + '.json', params).subscribe(response => {
        this.places = response.features;
        this.mapService.addMarkersToMap(this.places, this.userLocation!);
        this.isLoadingPlaces = false;
      });
    } else {
      this.places = [];
      this.mapService.cleanMarkers();
      this.isLoadingPlaces = false;
    }
  }

  public deletePlaces() {
    this.places = [];
  }

}
