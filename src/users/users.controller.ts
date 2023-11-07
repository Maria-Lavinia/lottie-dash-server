import { Controller, Get } from '@nestjs/common';

@Controller('cats')
export class UsersController {
  @Get()
  findAll(): string {
    return 'This action returns all users';
  }
}
