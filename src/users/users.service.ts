import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UseFilters } from '@nestjs/common';
import { SignupExceptionFilter } from './signup.exception-filter';
import { CreateUserDto } from './entities/create-user.dto';
import { UpdateUserDto } from './entities/update-user.dto';
import { encodePassword } from 'src/utils/bcrypt';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  @UseFilters(SignupExceptionFilter)
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userRepository.findOneBy({
      email: createUserDto.email,
    });
    if (existingUser) {
      throw new Error('Email already exists'); // Throw an error indicating that the email already exists
    }

    const password = encodePassword(createUserDto.password);
    const user = new User();
    user.email = createUserDto.email;
    user.password = password;
    user.firstName = createUserDto.firstName;
    user.lastName = createUserDto.lastName;

    const savedUser = await this.userRepository.save(user);
    return savedUser;
  }

  findAll() {
    return this.userRepository.find();
  }

  async findUserById(id: number): Promise<User> {
    return this.userRepository.findOne({
      where: { id: id },
    });
  }

  async findOne(username: string): Promise<User> {
    const result = await this.userRepository.findOne({
      where: { email: username },
    });
    return result;
  }

  findOneUser(id: number) {
    return this.userRepository.findOne({
      where: { id: id },
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const toUpdate = await this.userRepository.findOne({ where: { id } });

    if (updateUserDto.password) {
      const encryptedPassword = encodePassword(updateUserDto.password);
      updateUserDto.password = encryptedPassword;
    } else {
      delete updateUserDto.password; // Remove the password field from updateUserDto
    }

    const updated = Object.assign(toUpdate, updateUserDto);
    return await this.userRepository.save(updated);
  }

  async remove(id: number) {
    return await this.userRepository.delete(id);
  }
}
