import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty()
  @IsString()
  @MinLength(8)
  password: string;

  constructor(
    email: string,
    firstName: string,
    lastName: string,
    password: string,
  ) {
    this.email = email;
    this.firstName = firstName;
    this.lastName = lastName;
    this.password = password;
  }
}
