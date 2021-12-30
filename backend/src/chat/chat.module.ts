import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatEntity, ChatMessageEntity } from './chat.entity';
import { ChatProvider } from './chat.provider';
import { DatabaseModule } from 'src/database/database.module';
import { ChatService } from './chat.service';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [DatabaseModule, UserModule],
  controllers: [ChatController],
  providers: [...ChatProvider, ChatEntity, ChatMessageEntity, ChatService]
})
export class ChatModule {}
