import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { OneToOne, OneToMany } from 'typeorm';
import { DevEntity } from './dev.entity';
import { AdminEntity } from './admin.entity';
import { Role } from '../roles/role.enum';
import { AnimationEntity } from '../../animations/entities/animation.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @IsNotEmpty()
  @IsEmail()
  @Column()
  email: string;

  @IsNotEmpty()
  @Column()
  password: string;

  @IsNotEmpty()
  @Column()
  firstName: string;

  @IsNotEmpty()
  @Column()
  lastName: string;

  @OneToOne((type) => DevEntity, (dev) => dev.user)
  dev: DevEntity | null;

  @OneToOne((type) => AdminEntity, (admin) => admin.user)
  admin: AdminEntity | null;

  @Column({ type: 'enum', enum: Role, default: Role.User })
  role: Role | null;

  @OneToMany((type) => AnimationEntity, (animations) => animations)
  animations: AnimationEntity[];
}
