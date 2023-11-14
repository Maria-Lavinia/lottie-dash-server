import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { AuthModule } from '../../src/authentication/auth.module';
import { UsersModule } from '../users/users.module';
// import { HttpModule } from '@nestjs/axios';
import { AnimationEntity } from './entities/animation.entity';
import { AnimationsService } from './animations.service';
import { AnimationsController } from './animations.controller';

@Module({
  imports: [TypeOrmModule.forFeature([AnimationEntity]), UsersModule],
  controllers: [AnimationsController],
  providers: [AnimationsService],
})
export class AnimationsModule {}
