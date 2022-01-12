import { Controller,Post, UseInterceptors, UploadedFile, Req} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
// import { Public } from 'src/auth/jwt.decorator';
// import { HttpCode } from '@nestjs/common';
// import { extname } from 'path';
import { diskStorage } from 'multer'
import { Express } from 'express';
import { writeFile, writeFileSync } from 'fs';
import {createWriteStream} from 'fs';
import { GuardedRequest } from 'src/overloaded';
import { UserService } from 'src/user/user.service';

@Controller('avatar')
export class AvatarController {

    constructor(private userService: UserService) {}

    @Post("upload")
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(@Req() req: GuardedRequest, @UploadedFile() file: Express.Multer.File) {
        console.log(file);
        const path: string = './static/img/' + req.user.id + '.png';
        await writeFile(path, file.buffer, (data) => {
            console.log("saved succesfuli", data);
        });
		const user = await this.userService.getUserQueryOne({ where: {id: req.user.id}});
        user.avatar = 'img/' + req.user.id + '.png'
        this.userService.saveUser(user);
        console.log(file);
    }
}