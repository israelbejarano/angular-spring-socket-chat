import { Component, OnInit } from '@angular/core';
import { Client } from '@stomp/stompjs';
import { Mensaje } from '../../models/mensaje';
import * as SockJS from 'sockjs-client';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  private client: Client;
  mensaje: Mensaje = new Mensaje();
  mensajes: Mensaje[] = [];
  conectado = false;

  constructor() { }

  ngOnInit() {
    this.client = new Client();
    this.client.webSocketFactory = () => {
      return new SockJS('http://localhost:8080/chat-websocket');
    };
    this.client.onConnect = (frame) => {
      console.log('Conectados: ' + this.client.connected + ' : ' + frame);
      this.conectado = true;
      this.client.subscribe('/chat/mensaje', (e) => {
        const mensaje: Mensaje = JSON.parse(e.body) as Mensaje;
        this.mensajes.push(mensaje);
        console.log(mensaje);
      });
    };
    this.client.onDisconnect = (frame) => {
      console.log('Desconectados: ' + !this.client.connected + ' : ' + frame);
      this.conectado = false;
    };
  }

  conectar() {
    this.client.activate(); // para conectarnos

  }

  desconectar() {
    this.client.deactivate(); // para desconectarnos
  }

  enviarMensaje() {
    this.client.publish({destination: '/app/mensaje', body: JSON.stringify(this.mensaje)});
    this.mensaje.texto = '';
  }

}
