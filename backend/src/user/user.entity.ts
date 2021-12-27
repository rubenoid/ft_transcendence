import { Entity, Column, PrimaryColumn, JoinTable, ManyToMany, OneToMany } from 'typeorm';
import { ChatEntity } from 'src/chat/chat.entity';

@Entity()
export class UserEntity {
  @PrimaryColumn()
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

  @Column("int", { array: true, nullable: true })
  blockedUsers: number[];

  @Column("int", { array: true, nullable: true })
  blockedBy: number[];

  
  @ManyToMany( () => ChatEntity, (chat) => chat.users)//, UserEntity => UserEntity.Friends)
  channels: ChatEntity[];
}
