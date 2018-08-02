import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tablas',
  templateUrl: './tablas.component.html',
  styleUrls: ['./tablas.component.css']
})
export class TablasComponent implements OnInit {

  lat: number = 2.937313;
  lng: number = -75.302588;
  zoom: number = 16;

  constructor(
  ) {
  }

  ngOnInit() {

  }


}
