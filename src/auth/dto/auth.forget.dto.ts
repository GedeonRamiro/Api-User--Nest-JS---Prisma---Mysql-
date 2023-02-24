import { IsEmail, IsString } from 'class-validator';

export class AuthForgetDTO {
  @IsEmail(undefined, { message: 'Formato de e-mail digitado não é valido' })
  email: string;
}
