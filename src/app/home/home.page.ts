import { Component, ViewChild } from '@angular/core';
import { MqttService } from '../services/mqtt.service';
import { Chart } from '../../assets/chart/Chart.js';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
    @ViewChild('pieChart', null) pieChart;

        pie: any;
        constructor(private MQTT: MqttService) {
          
        }

        ionViewDidEnter() {
          this.createPieChart();
        }

        createPieChart() {
          this.pie = new Chart(this.pieChart.nativeElement, {
            type: 'pie',
            data: {
              labels: ["Living room", "Kitchen", "Dining room", "Bedroom", "Toilet"],
              datasets: [{
                label: "Detection count by room",
                backgroundColor: ["#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9","#c45850"],
                data: this.MQTT.getDetectionCountArray()
              }]
            },
            options: {
              title: {
                display: true,
                text: 'Detection count by room'
              }
            }
          });
        }
  }
