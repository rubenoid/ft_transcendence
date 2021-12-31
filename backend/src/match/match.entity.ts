import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	JoinColumn,
	OneToOne,
	ManyToMany,
	JoinTable,
} from "typeorm";
import { UserEntity } from "src/user/user.entity";
@Entity()
export class MatchEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToMany(() => UserEntity, (user) => user.matches)
	@JoinTable()
	players: UserEntity[];

	@Column()
	scorePlayer1: number;

	@Column()
	scorePlayer2: number;
}
