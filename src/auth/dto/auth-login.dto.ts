import { IsEmail, IsString, MinLength } from 'class-validator';

export class AuthLoginDTO {
  @IsEmail(undefined, { message: 'Formato de e-mail digitado não é valido' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'Senha deve ser no mínimo 6 caracteres' })
  password: string;
}
