import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseController } from './database/database.controller';
import { UserModule } from './user/user.module';
import { DatabaseModule } from './database/database.module';
import { FriendsModule } from './friends/friends.module';

@Module({
  imports: [ UserModule, DatabaseModule, FriendsModule],
  controllers: [AppController, DatabaseController],
  providers: [AppService],
})
export class AppModule {}
