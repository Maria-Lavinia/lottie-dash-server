import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { IsEmail, IsNotEmpty } from 'class-validator';

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
}
