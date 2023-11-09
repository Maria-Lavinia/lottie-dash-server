import {
  Body,
  Controller,
  Post,
  Req,
  Request as Request2,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { CreateUserDto } from 'src/users/entities/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  async signup(@Req() req, @Body() createUserDto: CreateUserDto) {
    console.log(createUserDto);
    return this.authService.signup(createUserDto);
  }
  // login
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Request2() req) {
    return this.authService.login(req.user);
  }
}
