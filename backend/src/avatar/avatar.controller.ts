import { Controller,Post, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
// import { Public } from 'src/auth/jwt.decorator';
// import { HttpCode } from '@nestjs/common';
// import { extname } from 'path';
import { diskStorage } from 'multer'
import { Express } from 'express';


@Controller('avatar')
export class AvatarController {
    @Post("upload")
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './uploads',
            // filename(_, file, callback)
            }),
        }),
        )
    uploadFile(@UploadedFile() file) {
        console.log("in avatar upload");
        console.log(file);
    }
}

    //     // @Public()
    //     @Post("upload")
    //     @UseInterceptors(FileInterceptor('image', {
    //         storage: diskStorage({
    //           destination: '../uploads'
    //           , filename: (req, file, cb) => {
    //             // Generating a 32 random chars long string
    //             const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('')
    //             //Calling the callback passing the random name generated with the original extension name
    //             cb(null, `${randomName}${extname(file.originalname)}`)
    //           }
    //         })
    //       }))
    //       uploadFile(@UploadedFile() file) {
    //         console.log("in avatar upload");
    //         console.log(file);
    //     }
    // }