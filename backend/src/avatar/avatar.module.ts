import { Module } from '@nestjs/common';
import { AvatarService } from './avatar.service';
import { AvatarController } from './avatar.controller';
import { MulterModule } from '@nestjs/platform-express';
import { UserModule  } from 'src/user/user.module';

@Module({
    imports: [UserModule ,MulterModule.register({
        dest: './uploads',
      })],
    	providers: [AvatarService],
	controllers: [AvatarController],  
})
export class AvatarModule {}
