import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './entities/update-user.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOneUser(@Param('id') id: string) {
    return this.usersService.findOneUser(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<{ message: string }> {
    return this.usersService.remove(id);
  }
}
