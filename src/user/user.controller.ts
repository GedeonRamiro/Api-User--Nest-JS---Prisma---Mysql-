import {
  Body,
  Controller,
  Post,
  Get,
  Put,
  Patch,
  Delete,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePutUserDto } from './dto/update-put.dto';
import { UpdatePacthUserDto } from './dto/update-patch.dto';
import { UserService } from './user.service';
import { LogInterceptor } from 'src/interceptors/log.interceptor';
import { ParamId } from 'src/decorators/param-id-decorator';
import { Roles } from 'src/decorators/roles-decorator';
import { Role } from 'src/enums/role.enum';
import { RoleGuard } from 'src/guards/role.guard';
import { AuthGuard } from 'src/guards/auth.guard';

@Roles(Role.Admin)
@UseGuards(AuthGuard, RoleGuard)
@UseInterceptors(LogInterceptor)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() data: CreateUserDto) {
    return await this.userService.create(data);
  }

  @Get()
  async getUsers() {
    return await this.userService.getUsers();
  }

  @Get(':id')
  async getUsersById(@ParamId() id: number) {
    return await this.userService.getUsersById(id);
  }

  @Put(':id')
  async updatePut(@Body() data: UpdatePutUserDto, @ParamId() id: number) {
    await this.getUsersById(id);
    return await this.userService.updatePut(id, data);
  }

  @Patch(':id')
  async updatePatch(@Body() data: UpdatePacthUserDto, @ParamId() id: number) {
    await this.getUsersById(id);
    return await this.userService.updatePatch(id, data);
  }

  @Delete(':id')
  async delete(@ParamId() id: number) {
    await this.getUsersById(id);

    return this.userService.delete(id);
  }
}
