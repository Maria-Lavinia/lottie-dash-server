import { Injectable } from '@nestjs/common';
import { User } from '../../src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { comparePasswords } from 'src/utils/bcrypt';
import { CreateUserDto } from 'src/users/entities/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signupDev(createUserDto: CreateUserDto) {
    return this.usersService.createDev(createUserDto);
  }

  async signupAdmin(createUserDto: CreateUserDto) {
    return this.usersService.createAdmin(createUserDto);
  }

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    console.log('user found', user);

    if (user) {
      const matched = comparePasswords(pass, user.password);
      if (matched) {
        return user;
      } else {
        console.log("Passwords don't match", user.password);
        return null;
      }
    }
    return null;
  }

  async login(user: User) {
    let payload: any = {
      username: user.email,
      id: user.id,
    };

    if (user.dev) {
      payload.devId = user.dev.id;
    } else if (user.admin) {
      payload.adminId = user.admin.id;
    }

    return {
      id: payload.id,
      access_token: this.jwtService.sign(payload),
    };
  }
}
