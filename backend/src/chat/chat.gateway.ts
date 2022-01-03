// import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';

// import { Socket, Server } from 'socket.io';
// import { io } from "socket.io-client";

// // server-side
// io.on("connection", (socket) => {
//   console.log(socket.id); // x8WIv7-mJelg7on_ALbx
// });

// @WebSocketGateway({cors:true})
// export class ChatGateway {
//   // message to server/ client 
//   //@SubscribeMessage('message')
//   // handleMessage(client: any, payload: any): string {
//   //   return 'Hello world!';
//   // }
//   @WebSocketServer()
//   server;
//   @SubscribeMessage('message')
//   handleMessage(client: Socket, payload: any): void {
//     // emit a message to everyone on the server 
//     console.log(payload);
//     this.server.emit('message', 'message');
//   }
// }


   
import {
	SubscribeMessage,
	WebSocketGateway,
	OnGatewayInit,
	WebSocketServer,
	OnGatewayConnection,
	OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
//import { ChatService, IncomingChatMessage } from './chat.service';
import { Logger } from '@nestjs/common';
// import { ChatMessage } from './chat.entity';


@WebSocketGateway({cors: {origin: '*'}})
export class ChatGateway
	implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer() server: Server;
	constructor() {}

	private logger: Logger = new Logger('ChatGateway');

	afterInit(server: Server) {
		this.logger.log('Init');
	}
	
	handleDisconnect(client: Socket) {
		this.logger.log(`Chat::Client disconnected: ${client.id}`);
	}
	
	handleConnection(client: Socket, ...args: any[]) {
		this.logger.log(`Chat::Client connected: ${client.id}`);
	}

	@SubscribeMessage('message')
  		handleMessage(client: any, payload: any): string {
			this.server.emit("message", "hallo terug")
    	return 'Hello world!';
  	}

}

