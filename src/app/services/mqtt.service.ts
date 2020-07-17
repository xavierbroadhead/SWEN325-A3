import { Injectable } from '@angular/core';
import {
  AlertController
} from '@ionic/angular';
import * as Paho from 'paho-mqtt';

@Injectable({
  providedIn: 'root'
})
export class MqttService {
  private mqttStatus: string = 'Disconnected';
  private mqttClient: any = null;
  private message: string = '';
  private messageToSend: string = '';
  private clientID: string = 'broadhxavi';
  public minsSinceDetection = 0;
  public secsSinceDetection = 0;
  public formattingSeconds = 0;
  public iterationCount = 0;
  private iterationCountArray = [0];
  public flag = false;
  private brokerOps = {
    host: 'barretts.ecs.vuw.ac.nz',
    port: 8883,
    topic: 'swen325/a3',
    path: '/mqtt'
  }

  //store data by room

  private living = {
    date: '',
    time: 'No time recorded',
    minsSinceDetection: 0,
    secsSinceDetection: 0,
    formattingSeconds: 0,
    roomTitle: 'living',
    detectionFlag: false,
    minsFlag: 0,
    detectionCount: 0,
    battery: 100,
    batteryHistory: [],
    iterationCount: 0,
    iterationCountArray: [0],
    colour: '#64ff63'
  }

  private kitchen = {
    date: '',
    time: 'No time recorded',
    minsSinceDetection: 0,
    secsSinceDetection: 0,
    formattingSeconds: 0,
    roomTitle: 'kitchen',
    detectionFlag: false,
    minsFlag: 0,
    detectionCount: 0,
    battery: 100,
    batteryHistory: [],
    iterationCount: 0,
    iterationCountArray: [0],
    colour: '#64ff63'
  }

  private dining = {
    date: '',
    time: 'No time recorded',
    minsSinceDetection: 0,
    secsSinceDetection: 0,
    formattingSeconds: 0,
    roomTitle: 'dining',
    detectionFlag: false,
    minsFlag: 0,
    detectionCount: 0,
    battery: 100,
    batteryHistory: [],
    iterationCount: 0,
    iterationCountArray: [0],
    colour: '#64ff63'
  }

  private toilet = {
    date: '',
    time: 'No time recorded',
    minsSinceDetection: 0,
    secsSinceDetection: 0,
    formattingSeconds: 0,
    roomTitle: 'toilet',
    detectionFlag: false,
    minsFlag: 0,
    detectionCount: 0,
    battery: 100,
    batteryHistory: [],
    iterationCount: 0,
    iterationCountArray: [0],
    colour: '#64ff63'
  }

  private bedroom = {
    date: '',
    time: 'No time recorded',
    minsSinceDetection: 0,
    secsSinceDetection: 0,
    formattingSeconds: 0,
    roomTitle: 'bedroom',
    detectionFlag: false,
    minsFlag: 0,
    detectionCount: 0,
    battery: 100,
    batteryHistory: [],
    iterationCount: 0,
    iterationCountArray: [0],
    colour: '#64ff63'
  }

  public roomLastDetected = "No movement has been detected yet.";

  constructor(public alertController: AlertController) {
  }


  public getLiving(){
    return this.living;
  }

  public getDining(){
    return this.dining;
  }

  public getKitchen(){
    return this.kitchen;
  }

  public getBedroom(){
    return this.bedroom;
  }

  public getToilet(){
    return this.toilet;
  }
  public getDetectionCountArray(){
    return [this.living.detectionCount, this.kitchen.detectionCount,
            this.dining.detectionCount, this.bedroom.detectionCount,
            this.toilet.detectionCount];
  }

  public getIterationCount(){
    return this.iterationCount;
  }

  public getBattery = (room: any) => {
    return room.battery;
  }

  public getStatus(): string {
    return this.mqttStatus;
  }
  public getIterationCountArray(){
    return this.iterationCountArray;
  }

  /*
    Called upon disconnection so that each connection is using fresh data.
  */
  private resetFields(): void {
    this.minsSinceDetection = 0;
    this.secsSinceDetection = 0;
    this.formattingSeconds = 0;
    this.iterationCount = 0;
    this.roomLastDetected = "No movement has been detected yet.";
    this.bedroom = {
        date: '',
        time: 'No time recorded',
        minsSinceDetection: 0,
        secsSinceDetection: 0,
        formattingSeconds: 0,
        roomTitle: 'bedroom',
        detectionFlag: false,
        minsFlag: 0,
        detectionCount: 0,
        battery: 100,
        batteryHistory: [],
        iterationCount: 0,
        iterationCountArray: [0],
        colour: '#64ff63'
    }
    this.toilet = {
      date: '',
      time: 'No time recorded',
      minsSinceDetection: 0,
      secsSinceDetection: 0,
      formattingSeconds: 0,
      roomTitle: 'toilet',
      detectionFlag: false,
      minsFlag: 0,
      detectionCount: 0,
      battery: 100,
      batteryHistory: [],
      iterationCount: 0,
      iterationCountArray: [0],
      colour: '#64ff63'
    }
    this.dining = {
        date: '',
        time: 'No time recorded',
        minsSinceDetection: 0,
        secsSinceDetection: 0,
        formattingSeconds: 0,
        roomTitle: 'dining',
        detectionFlag: false,
        minsFlag: 0,
        detectionCount: 0,
        battery: 100,
        batteryHistory: [],
        iterationCount: 0,
        iterationCountArray: [0],
        colour: '#64ff63'
    }
    this.kitchen = {
      date: '',
      time: 'No time recorded',
      minsSinceDetection: 0,
      secsSinceDetection: 0,
      formattingSeconds: 0,
      roomTitle: 'kitchen',
      detectionFlag: false,
      minsFlag: 0,
      detectionCount: 0,
      battery: 100,
      batteryHistory: [],
      iterationCount: 0,
      iterationCountArray: [0],
      colour: '#64ff63'
    }
    this.living = {
      date: '',
      time: 'No time recorded',
      minsSinceDetection: 0,
      secsSinceDetection: 0,
      formattingSeconds: 0,
      roomTitle: 'living',
      detectionFlag: false,
      minsFlag: 0,
      detectionCount: 0,
      battery: 100,
      batteryHistory: [],
      iterationCount: 0,
      iterationCountArray: [0],
      colour: '#64ff63'
    }
    this.flag = false;
    this.iterationCountArray = [0];
  }


  /*
    Connect to the MQTT broker.
  */
  public connect(): void {
    this.mqttStatus = 'Connecting...';
    this.mqttClient = new Paho.Client(this.brokerOps.host, this.brokerOps.port, this.brokerOps.path, this.clientID);

    // set callback handlers
    this.mqttClient.onConnectionLost = this.onConnectionLost;
    this.mqttClient.onMessageArrived = this.onMessageArrived;

    console.log('Connecting to mqtt via websocket');
    this.mqttClient.connect({timeout:10, useSSL: false, onSuccess:this.onConnect, onFailure: this.onFailure});
  }

  public disconnect(): void {
    if (this.mqttStatus == 'Connected'){
      this.mqttStatus = 'Disconnecting...';
      this.mqttClient.disconnect();
      this.mqttStatus = 'Disconnected';
      this.resetFields();
    }
  }

  public sendMessage(): void {
    if (this.mqttStatus == 'Connected'){
      this.mqttClient.publish(this.brokerOps.topic, this.messageToSend);
    }
  }

  /**
  *  Called each time a message is received from the broker. Filters
  *  the message by the room the reading was associated with before passing
  *  the room to the roomHandler method.
  *  @Param message - payload of the message received from the broker.
  */

  public messageHandler(message: string){
    const buffer = message.split(',');
    if (buffer[1] == 'living'){
      this.roomHandler(buffer, this.living);
    }
    else if (buffer[1] == 'kitchen'){
      this.roomHandler(buffer, this.kitchen);
    }
    else if (buffer[1] == 'dining'){
      this.roomHandler(buffer, this.dining);
    }
    else if (buffer[1] == 'toilet'){
      this.roomHandler(buffer, this.toilet);
    }
    else if (buffer[1] == 'bedroom'){
      this.roomHandler(buffer, this.bedroom);
    }
  }

  /**
  * Called from messageHandler, processes relevant data from the message payload.
  * This method is generic, it handles each message in the same way, however,
  * each change is made on the passed room, so as to provide some data consistency.
  * @Param message - message payload split into an array of its 4 different components
  * @Param room - the room object the message is associated with
  */
  public roomHandler(message: string[], room: any) {

    const flag = parseInt(message[2]);
    const batteryLevel = parseInt(message[3]);
    const date = message[0].split(' ')[0];
    const time = message[0].split(' ')[1];
    
    room.iterationCount++;
    room.iterationCountArray.push(room.iterationCount);

    if (flag == 0){
      room.detectionFlag = false;
    }
    else {
      room.detectionCount += 1;
      room.detectionFlag = true;
    }

    room.date = date;
    room.battery = batteryLevel;
    room.batteryHistory.push(batteryLevel);

    if (batteryLevel > 75){
      room.colour = '#64ff63';
    }
    else if (batteryLevel <= 75 && batteryLevel >= 50){
      room.colour = '#8bf799';
    }
    else if (batteryLevel <= 50 && batteryLevel >= 25){
      room.colour = '#fcbc3a';
    }
    else{
      room.colour = '#fc3a3a';
    }

    if (room.time == 'No time recorded'){
      room.time = time;
    }
    if (room.time != 'No time recorded'){
      if (flag == 0){
        this.timeHandler(time, room);
      }
      else {
        this.flag = true;
        this.secsSinceDetection = 0;
        this.minsSinceDetection = 0;
        this.formattingSeconds = 0;
        this.roomLastDetected = room.roomTitle;
        room.minsFlag = 0;
        room.minsSinceDetection = 0;
        room.secsSinceDetection = 0;
        room.formattingSeconds = 0;
      }
    }
  }

  /**
  * Called when no motion was detected in the passed room. Processes time passed
  * since detection and how this is stored both locally within the room object and globally.
  * @Param time - the timestamp for the passed room's message
  * @Param room - the room object the method will work on
  */
  public timeHandler(time: string, room: any){
    room.time = time;
    if (room.minsFlag < 5){
      room.minsFlag++;
      room.formattingSeconds += 10;
    }
    else{
      this.minsSinceDetection++;
      room.minsFlag = 0;
      room.formattingSeconds = 0;
    }

    room.secsSinceDetection += 10;
    this.formattingSeconds = room.formattingSeconds;

    if (room.secsSinceDetection > this.secsSinceDetection) {
      this.secsSinceDetection = room.secsSinceDetection;
    }

    if (this.secsSinceDetection >= 300){
      this.secsSinceDetection = 0;
      this.minsSinceDetection = 0;
      this.formattingSeconds = 0;
      this.handleNotification(this.roomLastDetected);
    }
  }

  /**
  * Called when no movement has been detected for 5 minutes. Pushes a notification
  * alerting user of the inactivity.
  * @Param room - the room where movement was last detected
  */

  public async handleNotification(room: any){
    const alert = await this.alertController.create({
      message: 'No movement detected in last 5 minutes, last movement detected in ' + room.roomTitle,
      buttons: [{
        text: 'Nice',
        role: 'cancel',
        handler: () => {
          console.log('Dismissed')
        }
      }],
    });
    alert.present();
    this.disconnect();
  }

  public onConnect = () => {
    console.log('Connected');
    this.mqttStatus = 'Connected';
    this.mqttClient.subscribe(this.brokerOps.topic);
  }

  public onFailure = (responseObject) => {
    console.log('Failed to connect');
    this.mqttStatus = 'Failed to connect';
  }

  public onConnectionLost = (responseObject) => {
    if (responseObject.errorCode !== 0){
      this.mqttStatus = 'Disconnected';
    }
  }

  public onMessageArrived = (message) => {
    console.log('Received message');
    console.log(message.payloadString);
    this.iterationCount += 1;
    this.iterationCountArray.push(this.iterationCount);
    this.message = message.payloadString;
    this.messageHandler(this.message);
  }

}
