import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';

@WebSocketGateway({cors:true})
export class ChatGateway {
  // message to server/ client 
  //@SubscribeMessage('message')
  // handleMessage(client: any, payload: any): string {
  //   return 'Hello world!';
  // }
  @WebSocketServer()
  server;
  @SubscribeMessage('message')
  handleMessage(@MessageBody() message:string): void {
    // emit a message to everyone on the server 
    this.server.emit('message', message);
  }
}


