import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne } from 'typeorm';
import { UserEntity } from 'src/user/user.entity';
@Entity()
export class MatchEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => UserEntity)
  @JoinColumn()
  player1: UserEntity;

  @OneToOne(() => UserEntity)
  @JoinColumn()
  player2: UserEntity;

  @Column()
  scorePlayer1: number;

  @Column()
  scorePlayer2: number;
}
