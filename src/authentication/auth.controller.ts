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
import { CreateUserDto } from '../users/entities/create-user.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signupdev')
  async signupDev(@Req() req, @Body() createUserDto: CreateUserDto) {
    console.log(createUserDto);
    return this.authService.signupDev(createUserDto);
  }

  @Post('/signupadmin')
  async signupAdmin(@Req() req, @Body() createUserDto: CreateUserDto) {
    console.log(createUserDto);
    return this.authService.signupAdmin(createUserDto);
  }

  // login
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Request2() req) {
    return this.authService.login(req.user);
  }
}
