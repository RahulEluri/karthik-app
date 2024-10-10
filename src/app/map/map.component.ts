import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GoogleMapsModule } from '@angular/google-maps';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import * as bootstrap from 'bootstrap'; // Import Bootstrap's JS

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [GoogleMapsModule, CommonModule, FormsModule, NgxChartsModule],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css',
})
export class MapComponent {
  @ViewChild('offcanvasElement', { static: false })
  offcanvasElement!: ElementRef;

  center: google.maps.LatLngLiteral = { lat: 40.73061, lng: -73.935242 };
  zoom = 5;

  // Mock locations with weather data
  locations = [
    {
      lat: 40.73061,
      lng: -73.935242,
      label: 'New York',
      description: 'New York City weather data',
      weatherData: [
        { name: 'Mon', value: 22 },
        { name: 'Tue', value: 25 },
        { name: 'Wed', value: 21 },
        { name: 'Thu', value: 23 },
        { name: 'Fri', value: 24 },
        { name: 'Sat', value: 26 },
        { name: 'Sun', value: 27 },
      ],
    },
    {
      lat: 34.052235,
      lng: -118.243683,
      label: 'Los Angeles',
      description: 'Los Angeles weather data',
      weatherData: [
        { name: 'Mon', value: 28 },
        { name: 'Tue', value: 30 },
        { name: 'Wed', value: 29 },
        { name: 'Thu', value: 31 },
        { name: 'Fri', value: 32 },
        { name: 'Sat', value: 33 },
        { name: 'Sun', value: 34 },
      ],
    },
    {
      lat: 41.878113,
      lng: -87.629799,
      label: 'Chicago',
      description: 'Chicago weather data',
      weatherData: [
        { name: 'Mon', value: 18 },
        { name: 'Tue', value: 20 },
        { name: 'Wed', value: 19 },
        { name: 'Thu', value: 21 },
        { name: 'Fri', value: 22 },
        { name: 'Sat', value: 23 },
        { name: 'Sun', value: 24 },
      ],
    },
    {
      lat: 29.760427,
      lng: -95.369804,
      label: 'Houston',
      description: 'Houston weather data',
      weatherData: [
        { name: 'Mon', value: 26 },
        { name: 'Tue', value: 28 },
        { name: 'Wed', value: 27 },
        { name: 'Thu', value: 29 },
        { name: 'Fri', value: 30 },
        { name: 'Sat', value: 31 },
        { name: 'Sun', value: 32 },
      ],
    },
  ];

  filteredLocations = [...this.locations]; // Filtered locations
  selectedLocation: any; // Location selected via map click or search
  customColors: any[] = []; // To store dynamic colors for chart

  // Function to calculate color based on the temperature value
  getColor(value: number): string {
    const minTemp = 10; // Minimum temperature in our dataset
    const maxTemp = 40; // Maximum temperature in our dataset

    const ratio = (value - minTemp) / (maxTemp - minTemp);
    const red = Math.min(255, Math.floor(ratio * 255));
    const green = Math.min(255, Math.floor((1 - ratio) * 255));

    return `rgb(${red}, ${green}, 0)`; // Dynamic color from green to red
  }

  // Function to create a colored circle as a data URL
  createMarkerIcon(color: string): string {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    canvas.width = 20;
    canvas.height = 20;

    if (context) {
      // Draw a filled circle
      context.fillStyle = color;
      context.beginPath();
      context.arc(10, 10, 10, 0, 2 * Math.PI);
      context.fill();
      context.strokeStyle = '#000'; // Optional stroke
      context.stroke();
    }

    return canvas.toDataURL(); // Return data URL for the marker icon
  }

  // Function to generate marker icon based on average temperature
  getMarkerIcon(location: any): google.maps.Icon {
    const avgTemp = this.getAverageTemperature(location.weatherData);
    const color = this.getColor(avgTemp); // Get the color based on average temperature

    return {
      url: this.createMarkerIcon(color),
      scaledSize: new google.maps.Size(40, 40), // Adjust size of the marker
    };
  }

  // Function to calculate the average temperature of a location
  getAverageTemperature(weatherData: any[]): number {
    const total = weatherData.reduce((sum, day) => sum + day.value, 0);
    return total / weatherData.length;
  }

  // Function to generate custom colors for the bar chart
  generateCustomColors(location: any) {
    this.customColors = location.weatherData.map((d: any) => ({
      name: d.name,
      value: this.getColor(d.value),
    }));
  }

  // Function to open offcanvas and show weather data for the selected location
  openOffCanvas(location: any) {
    this.selectedLocation = location;

    // Generate the custom colors based on temperature
    this.generateCustomColors(location);

    if (this.offcanvasElement) {
      const offCanvas = new bootstrap.Offcanvas(
        this.offcanvasElement.nativeElement
      );
      offCanvas.show();
    }
  }

  searchLocation() {
    const searchTerm = this.searchTerm.toLowerCase();
    const foundLocation = this.locations.find((location) =>
      location.label.toLowerCase().includes(searchTerm)
    );

    if (foundLocation) {
      this.center = { lat: foundLocation.lat, lng: foundLocation.lng };
      this.zoom = 12;
      this.openOffCanvas(foundLocation);
    }
  }

  searchTerm: string = ''; // Bound to the input field
}
