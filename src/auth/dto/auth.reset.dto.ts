import { IsJWT, IsString, MinLength } from 'class-validator';

export class AuthResetDTO {
  @IsString()
  @MinLength(6, { message: 'Senha deve ser no mínimo 6 caracteres' })
  password: string;

  @IsJWT({ message: 'Token inválido' })
  token: string;
}
