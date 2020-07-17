import { Component, ViewChild } from '@angular/core';
import { MqttService } from '../services/mqtt.service';
import { Chart } from '../../assets/chart/Chart.js';

@Component({
  selector: 'app-data',
  templateUrl: './data.page.html',
  styleUrls: ['./data.page.scss'],
})
export class DataPage {
  @ViewChild('lineChart', null) lineChart;

    line: any;
    constructor(private MQTT: MqttService) {
    }

    ionViewDidEnter() {
      this.createLineChart();
    }

    createLineChart(){
      this.line = new Chart(this.lineChart.nativeElement, {
        type: 'line',
        data: {
          labels: this.MQTT.getLiving().iterationCountArray,
          datasets: [{
            data: this.MQTT.getLiving().batteryHistory,
            label: 'Living room',
            borderColor: '#3e95cd',
            fill: false
          }, {
            data: this.MQTT.getKitchen().batteryHistory,
            label: 'Kitchen',
            borderColor: '#8e5ea2',
            fill: false
          }, {
            data: this.MQTT.getDining().batteryHistory,
            label: 'Dining room',
            borderColor: '#3cba9f',
            fill: false
          }, {
            data: this.MQTT.getBedroom().batteryHistory,
            label: 'Bedroom',
            borderColor: '#e8c3b9',
            fill: false
          }, {
            data: this.MQTT.getToilet().batteryHistory,
            label: 'Toilet',
            borderColor: '#c45850',
            fill: false
          }]
        },
        options: {
          title: {
            display: true,
            text: 'Battery level over time'
          },
          events: [],
        }
      });
    }

}
