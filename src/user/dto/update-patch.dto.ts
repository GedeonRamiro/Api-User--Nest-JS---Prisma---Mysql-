import { PartialType } from '@nestjs/mapped-types';
import { IsDate, IsOptional } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class UpdatePacthUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @IsDate()
  updateAt: Date;
}
