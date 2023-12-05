import { User } from '../../users/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { IsNotEmpty } from 'class-validator';

@Entity()
export class AnimationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @IsNotEmpty()
  @Column()
  fileName: string;

  @IsNotEmpty()
  @Column()
  projectName: string;

  @IsNotEmpty()
  @Column({ type: 'text' })
  jsonData: string;

  @ManyToOne(() => User, (user) => user.animations)
  user: User;
}
