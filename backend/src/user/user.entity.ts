import {
	Entity,
	Column,
	PrimaryColumn,
	JoinTable,
	ManyToMany,
	OneToMany,
} from "typeorm";
import { ChatEntity } from "src/chat/chat.entity";
import { MatchEntity } from "src/match/match.entity";

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
	avatar: string;

	@Column()
	wins: number;

	@Column()
	losses: number;

	@Column()
	rating: number;

	@Column({ default: false })
	registered: boolean;

	@Column({ default: false })
	logedin: boolean;

	@Column({ default: "" })
	twoFactorSecret: string;

	@Column({ default: false })
	twoFactorvalid: boolean;

	@ManyToMany(() => UserEntity, {
		onDelete: "SET NULL",
		cascade: true,
		nullable: true,
	})
	@JoinTable()
	friends: UserEntity[];

	@ManyToMany(() => MatchEntity, (match) => match.players)
	matches: MatchEntity[];

	@Column("int", { array: true, nullable: true })
	blockedUsers: UserEntity[];

	@Column("int", { array: true, nullable: true })
	blockedBy: number[];

	@ManyToMany(() => ChatEntity, (chat) => chat.users) //, UserEntity => UserEntity.Friends)
	channels: ChatEntity[];
}
