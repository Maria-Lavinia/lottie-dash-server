import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { DevEntity } from './entities/dev.entity';
import { AdminEntity } from './entities/admin.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, DevEntity, AdminEntity])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [
    UsersService,
    TypeOrmModule.forFeature([User, DevEntity, AdminEntity]),
  ],
})
export class UsersModule {}
