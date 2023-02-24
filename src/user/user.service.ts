import {
  BadGatewayException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PasswordBcryptjs } from 'src/password -bcryptjs/PasswordBcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePacthUserDto } from './dto/update-patch.dto';
import { UpdatePutUserDto } from './dto/update-put.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateUserDto) {
    const email = data.email;

    const user = await this.prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (user) {
      throw new BadGatewayException('E-mail já existe na base de dados!');
    }

    data.password = await PasswordBcryptjs.hashPasswords(data.password);

    return await this.prisma.user.create({ data });
  }

  async getUsers() {
    return await this.prisma.user.findMany();
  }

  async getUsersById(id: number) {
    const resultGetUsersById = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!resultGetUsersById) {
      throw new NotFoundException('Usuáiro não existe na base de dados!');
    }

    return resultGetUsersById;
  }

  async delete(id: number) {
    return await this.prisma.user.delete({ where: { id } });
  }

  async updatePut(id: number, data: UpdatePutUserDto) {
    data.password = await PasswordBcryptjs.hashPasswords(data.password);
    data.updateAt = new Date();

    return this.prisma.user.update({ data, where: { id } });
  }

  async updatePatch(id: number, data: UpdatePacthUserDto) {
    if (data.password) {
      data.password = await PasswordBcryptjs.hashPasswords(data.password);
    }
    data.updateAt = new Date();
    return this.prisma.user.update({ data, where: { id } });
  }
}
