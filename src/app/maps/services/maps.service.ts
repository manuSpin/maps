import { Injectable } from '@angular/core';
import { AnySourceData, LngLatBounds, LngLatLike, Map, Marker, Popup } from 'mapbox-gl';
import { Place } from '../interfaces/places';
import { DirectionApiClient } from '../api';
import { DirectionsResponse, Route } from '../interfaces/directions';

@Injectable({
  providedIn: 'root'
})
export class MapsService {

  private map?: Map;
  private markers: Marker[] = [];

  constructor(private directionsApi: DirectionApiClient) { }

  public get isMapReady(): boolean {
    return !!this.map;
  }

  public setMap(map: Map): void {
    this.map = map;
  }

  public flyTo(coords: LngLatLike): void {
    if (!this.isMapReady) {
      throw Error('El mapa no está listo');
    }

    this.map?.flyTo({
      zoom: 14,
      center: coords
    });
  }

  public addMarkersToMap(places: Place[], userLocation: [number, number]): void {
    if (!this.isMapReady) {
      throw Error('El mapa no está listo');
    }

    if (this.markers.length !== 0) {
      this.cleanMarkers();
    }

    const bounds = new LngLatBounds(userLocation, userLocation);

    places.forEach(place => {
      const [lng, lat] = place.center;

      const popup = new Popup().setHTML(`
        <h6>${place.text_es}</h6>
        <span>${place.place_name_es}</span>
      `);

      const marker = new Marker({ color: 'blue' }).setLngLat([lng, lat]).setPopup(popup).addTo(this.map!);
      bounds.extend(marker.getLngLat());
      this.markers.push(marker);
    });

    this.map?.fitBounds(bounds, { padding: 200 });
  }

  public cleanMarkers() {
    this.markers.forEach(marker => {
      marker.remove();
    });
  }

  public getRouteBetweenPoints(start: [number, number], end: [number, number]) {
    this.directionsApi.get<DirectionsResponse>(start.join(',') + ';' + end.join(',')).subscribe(response => {
      this.drawPolyline(response.routes[0]);
    });
  }

  private drawPolyline(route: Route) {
    console.log({ kms: route.distance / 1000, duration: route.duration / 60 });

    if (!this.map) {
      throw Error('El mapa no está inicializado');
    }

    const coords = route.geometry.coordinates;
    const bounds = new LngLatBounds();

    coords.forEach(([lng, lat]) => {
      bounds.extend([lng, lat]);
    });

    this.map?.fitBounds(bounds, { padding: 200 });

    const sourceData: AnySourceData = {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: coords
            }
          }
        ]
      }
    }
    if (this.map.getLayer('RouteString')) {
      this.map.removeLayer('RouteString');
      this.map.removeSource('RouteString');
    }

    this.map.addSource('RouteString', sourceData);
    this.map.addLayer({
      id: 'RouteString',
      type: 'line',
      source: 'RouteString',
      layout: {
        "line-cap": 'round',
        "line-join": 'round'
      },
      paint: {
        "line-color": 'limegreen',
        "line-width": 3
      }
    });
  }

}
