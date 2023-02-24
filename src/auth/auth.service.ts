import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { AuthRegisterDTO } from './dto/auth-register-dto';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from 'src/prisma/prisma.service';
import { PasswordBcryptjs } from 'src/password -bcryptjs/PasswordBcryptjs';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class AuthService {
  private ISSUER = 'Login';
  private AUDIENCE = 'Users';

  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly mailer: MailerService,
  ) {}

  createToken(user: User) {
    return {
      accessToken: this.jwtService.sign(
        {
          id: user.id,
          name: user.name,
          email: user.email,
        },
        {
          subject: String(user.id),
          expiresIn: '7 days',
          issuer: this.ISSUER,
          audience: this.AUDIENCE,
        },
      ),
    };
  }

  checkToken(token: string) {
    try {
      const data = this.jwtService.verify(token, {
        issuer: this.ISSUER,
        audience: this.AUDIENCE,
      });
      return data;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  isValindToken(token: string) {
    try {
      this.checkToken(token);
      return true;
    } catch (error) {
      return false;
    }
  }

  async register(data: AuthRegisterDTO) {
    const user = await this.prisma.user.create({ data });

    return this.createToken(user);
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (!user) {
      throw new UnauthorizedException('E-mail ou senha incorretas!');
    }

    const passwordMatch = await PasswordBcryptjs.verifyPasswords(
      password,
      user.password,
    );

    if (!passwordMatch) {
      throw new UnauthorizedException('E-mail ou senha incorretas!');
    }

    return this.createToken(user);
  }

  async forget(email: string) {
    const user = await this.prisma.user.findFirst({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('E-mail está incorreto!');
    }

    const token = this.jwtService.sign(
      {
        id: user.id,
      },
      {
        subject: String(user.id),
        expiresIn: '30 minutes',
        issuer: 'forget',
        audience: 'users',
      },
    );

    await this.mailer.sendMail({
      subject: 'Recuperação de senha',
      to: 'gedeon@hotmail.com',
      template: 'forget',
      context: {
        name: user.name,
        token: token,
      },
    });

    return true;
  }

  async reset(password: string, token: string) {
    try {
      const data: any = this.jwtService.verify(token, {
        issuer: 'forget',
        audience: 'users',
      });

      if (isNaN(Number(data.id))) {
        throw new BadRequestException('Token é inválido.');
      }

      const newPassword = await PasswordBcryptjs.hashPasswords(password);

      const user = await this.prisma.user.update({
        where: {
          id: Number(data.id),
        },
        data: {
          password: newPassword,
        },
      });

      return this.createToken(user);
    } catch (e) {
      throw new BadRequestException(e);
    }
  }
}
