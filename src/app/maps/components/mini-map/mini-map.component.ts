import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { LngLat, Map, Marker } from 'mapbox-gl';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'map-mini-map',
  templateUrl: './mini-map.component.html',
  styleUrl: './mini-map.component.css'
})
export class MiniMapComponent implements AfterViewInit {

  @Input() lngLat?: [number, number];

  @ViewChild('map')
  public divMap?: ElementRef;

  public zoom: number = 15;

  ngAfterViewInit(): void {
    if ( !this.divMap?.nativeElement ) throw "Map div not found";
    if ( !this.lngLat ) throw "LngLat can't be null";

    const map = new Map({
      accessToken: environment.mapbox_key,
      container: this.divMap?.nativeElement, // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: this.lngLat,
      zoom: this.zoom, // starting zoom
      interactive: false,
    });

    new Marker({
      color: '#xxxxxx'.replace(/x/g, y=>(Math.random()*16|0).toString(16)),
    })
      .setLngLat(this.lngLat)
      .addTo(map);
  }

}
