import {
  BadGatewayException,
  Body,
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import { join } from 'path';
import { UserDecorator } from 'src/decorators/user.decorators';
import { FileService } from 'src/file/file.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { AuthService } from './auth.service';
import { AuthLoginDTO } from './dto/auth-login.dto';
import { AuthRegisterDTO } from './dto/auth-register-dto';
import { AuthForgetDTO } from './dto/auth.forget.dto';
import { AuthResetDTO } from './dto/auth.reset.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly fileService: FileService,
  ) {}

  @Post('login')
  async login(@Body() { email, password }: AuthLoginDTO) {
    return await this.authService.login(email, password);
  }

  @Post('register')
  async register(@Body('register') body: AuthRegisterDTO) {
    return this.authService.register(body);
  }

  @Post('forget')
  async forget(@Body() { email }: AuthForgetDTO) {
    return await this.authService.forget(email);
  }

  @Post('reset')
  async reset(@Body() { password, token }: AuthResetDTO) {
    return await this.authService.reset(password, token);
  }

  @UseGuards(AuthGuard)
  @Post('me')
  async me(@UserDecorator('email') user) {
    return { user };
  }

  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(AuthGuard)
  @Post('photo')
  async uploadPhoto(
    @UserDecorator() user,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
          new MaxFileSizeValidator({ maxSize: 1024 * 200 }),
        ],
      }),
    )
    photo: Express.Multer.File,
  ) {
    const path = join(
      __dirname,
      '..',
      '..',
      'storage',
      'photo',
      `photo-${user.id}`,
    );

    try {
      await this.fileService.upload(photo, path);
    } catch (error) {
      throw new BadGatewayException(error);
    }

    return photo;
  }

  @UseInterceptors(
    FileFieldsInterceptor([
      {
        name: 'photo',
        maxCount: 1,
      },
      {
        name: 'documents',
        maxCount: 10,
      },
    ]),
  )
  @UseGuards(AuthGuard)
  @Post('files-fields')
  async uploadFilesFields(
    @UserDecorator() user,
    @UploadedFile('files')
    files: { photo: Express.Multer.File; documents: Express.Multer.File[] },
  ) {
    return files;
  }
}
