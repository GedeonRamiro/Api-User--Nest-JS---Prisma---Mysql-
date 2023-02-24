import {
  createParamDecorator,
  ExecutionContext,
  NotFoundException,
} from '@nestjs/common';

export const UserDecorator = createParamDecorator(
  (filter: string, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();

    if (!request.user)
      throw new NotFoundException(
        'Usuário não encontrado no Request. Use o AuthAguard para obter o usuário.',
      );

    if (filter) {
      return request.user[filter];
    }

    return request.user;
  },
);
