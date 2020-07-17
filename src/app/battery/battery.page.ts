import { Component } from '@angular/core';
import { MqttService } from '../services/mqtt.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-battery',
  templateUrl: './battery.page.html',
  styleUrls: ['./battery.page.scss'],
})
export class BatteryPage {

  constructor(public MQTT: MqttService, private sanitizer: DomSanitizer) {
  }

  getDynamicCardColour(colour) {
    return this.sanitizer.bypassSecurityTrustStyle(`--myvar: ${colour}`);
  }

  getDynamicBatteryPercentage(percentage){
    return this.sanitizer.bypassSecurityTrustStyle(`--percentage ${percentage}`);
  }
}
