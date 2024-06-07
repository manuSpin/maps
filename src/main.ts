import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = 'pk.eyJ1IjoibWFudWVsYmFiZWwiLCJhIjoiY2x3a2UzcjNrMDJyZTJxbngyaThhYWE5aCJ9.PaXdjX80WCDZuQo_kkhsfA';

if (!navigator.geolocation) {
  alert('Sin geolocalización;')
  throw new Error('Sin geolocalización;')
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
