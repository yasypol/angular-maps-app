import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { LngLat, Map, Marker } from 'mapbox-gl';
import { environment } from '../../../../environments/environment';

interface MarkerAndColor {
  color: string;
  marker: Marker;
}

interface PlainMarker {
  color: string;
  lngLat: number[]
}

@Component({
  templateUrl: './markers-page.component.html',
  styleUrl: './markers-page.component.css'
})
export class MarkersPageComponent implements AfterViewInit {

  @ViewChild('map')
  public divMap?: ElementRef;

  public markers: MarkerAndColor[] = [];
  public map?: Map;
  public currentLngLat: LngLat = new LngLat(-16.2565, 28.4635);

  ngAfterViewInit(): void {

    if ( !this.divMap ) throw 'El elemento HTML no fue encontrado';

    this.map = new Map({
      accessToken: environment.mapbox_key,
      container: this.divMap?.nativeElement, // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: this.currentLngLat, // starting position [lng, lat]
      zoom: 14, // starting zoom
    });

    this.readFromLocalStorage();

    // const markerHtml = document.createElement('div');
    // markerHtml.innerHTML = 'amparo';

    // const marker = new Marker({
    //   // color: 'green'
    //   element: markerHtml
    // })
      // .setLngLat( this.currentLngLat)
      // .addTo(this.map);
  }

  public createMarker(): void {
    if ( !this.map ) return;

    const color = '#xxxxxx'.replace(/x/g, y=>(Math.random()*16|0).toString(16));
    const lngLat = this.map?.getCenter();

    this.addMarker(lngLat, color);
  }

  private addMarker(lngLat: LngLat, color: string): void {
    if (!this.map) return;

    const marker = new Marker({
      color: color,
      draggable: true,
    })
      .setLngLat(lngLat)
      .addTo(this.map);

    this.markers.push({ color: color, marker: marker });
    this.saveToLocalStorage();

    marker.on('dragend', (ev) => {
      this.saveToLocalStorage();
    });
  }

  public deleteMarker( index: number): void {
    this.markers[index].marker.remove();
    this.markers.splice(index, 1);
  }

  public flyTo( marker: Marker): void {
    this.map?.flyTo({
      zoom: 16,
      center: marker.getLngLat()
    })
  }

  public saveToLocalStorage() {
    const plainMarkers: PlainMarker[] = this.markers.map( ({ color, marker }) => {
      return {
        color,
        lngLat: marker.getLngLat().toArray()
      }
    });

    localStorage.setItem('plainMarkers', JSON.stringify(plainMarkers) );
  }

  public readFromLocalStorage() {
    const plainMarkersString = localStorage.getItem('plainMarkers') ?? '[]';
    const plainMarkers: PlainMarker[] = JSON.parse(plainMarkersString);

    plainMarkers.forEach( ({ color, lngLat }) => {
      const [lng, lat] = lngLat;
      const coords = new LngLat(lng, lat);

      this.addMarker(coords, color);
    })
  }
}
