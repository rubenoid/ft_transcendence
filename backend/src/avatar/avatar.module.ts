import { Module } from '@nestjs/common';
import { AvatarService } from './avatar.service';
import { AvatarController } from './avatar.controller';
import { MulterModule } from '@nestjs/platform-express';
@Module({
    imports: [MulterModule.register({
        dest: './uploads',
      })],
    	providers: [AvatarService],
	controllers: [AvatarController],  
})
export class AvatarModule {}
