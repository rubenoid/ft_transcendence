import { Entity, Column, PrimaryGeneratedColumn, JoinTable, ManyToMany, OneToMany } from 'typeorm';

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

  @ManyToMany( () => UserEntity, {onDelete: "SET NULL", cascade: true})//, UserEntity => UserEntity.Friends)
  @JoinTable()
  friends: UserEntity[];

  @Column("int", { array: true })
  blockedUsers: number[];

  @Column("int", { array: true })
  blockedBy: number[];
}