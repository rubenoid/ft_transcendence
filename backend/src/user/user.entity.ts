import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userName: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  wins: number;

  @Column()
  losses: number;

  @Column()
  rating: number;

  @Column({ default: true })
  isActive: boolean;

}
