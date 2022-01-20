import {
	Entity,
	Column,
	PrimaryColumn,
	JoinColumn,
	OneToOne,
	ManyToMany,
	JoinTable,
} from "typeorm";
import { UserEntity } from "src/user/user.entity";
@Entity()
export class MatchEntity {
	@PrimaryColumn()
	id: string;

	@ManyToMany(() => UserEntity, (user) => user.matches, { cascade: true })
	@JoinTable()
	players: UserEntity[];

	@Column()
	scorePlayer1: number;

	@Column()
	scorePlayer2: number;
}
