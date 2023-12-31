import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UseFilters } from '@nestjs/common';
import { SignupExceptionFilter } from './signup.exception-filter';
import { CreateUserDto } from './entities/create-user.dto';
import { UpdateUserDto } from './entities/update-user.dto';
import { encodePassword } from '../utils/bcrypt';
import { Role } from './roles/role.enum';
import { DevEntity } from './entities/dev.entity';
import { AdminEntity } from './entities/admin.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(DevEntity)
    private devRepository: Repository<DevEntity>,
    @InjectRepository(AdminEntity)
    private adminRepository: Repository<AdminEntity>,
  ) {}

  // signup dev and admin
  @UseFilters(SignupExceptionFilter)
  async createDev(createUserDto: CreateUserDto): Promise<DevEntity> {
    const existingUser = await this.userRepository.findOneBy({
      email: createUserDto.email,
    });
    if (existingUser) {
      throw new Error('Email already exists'); // Throw an error indicating that the email already exists
    }

    const password = encodePassword(createUserDto.password);
    const user = new User();
    if (createUserDto.email.split('@')[1] !== 'frankly.dk') {
      throw new Error('Invalid email domain');
    } else {
      user.email = createUserDto.email;
    }

    user.password = password;
    user.firstName = createUserDto.firstName;
    user.lastName = createUserDto.lastName;
    user.role = Role.User;

    const savedUser = await this.userRepository.save(user);

    const dev = new DevEntity();
    dev.name = createUserDto.firstName;
    dev.email = createUserDto.email;
    dev.user = savedUser;
    console.log('dev entity', dev);
    return this.devRepository.save(dev);
  }

  @UseFilters(SignupExceptionFilter)
  async createAdmin(createUserDto: CreateUserDto): Promise<AdminEntity> {
    const existingUser = await this.userRepository.findOneBy({
      email: createUserDto.email,
    });
    if (existingUser) {
      throw new Error('Email already exists'); // Throw an error indicating that the email already exists
    }

    const password = encodePassword(createUserDto.password);
    const user = new User();
    if (createUserDto.email.split('@')[1] !== 'frankly.dk') {
      throw new Error('Invalid email domain');
    } else {
      user.email = createUserDto.email;
    }
    user.password = password;
    user.firstName = createUserDto.firstName;
    user.lastName = createUserDto.lastName;
    user.role = Role.Admin;

    const savedUser = await this.userRepository.save(user);

    const admin = new AdminEntity();
    admin.name = createUserDto.firstName;
    admin.email = createUserDto.email;
    admin.user = savedUser;
    console.log('admin entity', admin);
    return this.adminRepository.save(admin);
  }

  async findOne(username: string): Promise<User> {
    const result = await this.userRepository.findOne({
      where: { email: username },
      relations: { dev: true, admin: true },
    });
    return result;
  }

  // GET all users
  findAll() {
    return this.userRepository.find();
  }

  // GET user by id
  async findUserById(id: number): Promise<User> {
    return this.userRepository.findOne({
      where: { id: id },
    });
  }

  //  GET user by id
  findOneUser(id: number) {
    return this.userRepository.findOne({
      where: { id: id },
    });
  }

  // PUT user by id
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

  async remove(id: number): Promise<{ message: string }> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (user) {
      const dev = await this.devRepository
        .createQueryBuilder('dev')
        .innerJoin('dev.user', 'user')
        .where('user.id = :id', { id })
        .getOne();

      if (dev) {
        // Delete the dev entity
        await this.devRepository.delete(dev.id);
      }

      const admin = await this.adminRepository
        .createQueryBuilder('admin')
        .innerJoin('admin.user', 'user')
        .where('user.id = :id', { id })
        .getOne();

      if (admin) {
        // Delete the admin entity
        await this.adminRepository.delete(admin.id);
      }

      // Delete the user entity
      await this.userRepository.delete(user.id);

      return { message: 'User and related entities deleted' };
    }

    throw new Error('User not found');
  }
}
