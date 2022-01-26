import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	JoinTable,
	ManyToMany,
	OneToMany,
	ManyToOne,
} from "typeorm";
import { UserEntity } from "src/user/user.entity";

@Entity()
export class ChatEntity {
	@PrimaryGeneratedColumn("increment")
	id: number;

	@Column()
	password: string;

	@Column()
	isPublic: boolean;

	@Column()
	name: string;

	@ManyToMany(() => UserEntity, (user) => user.channels, { cascade: true })
	@JoinTable()
	users: UserEntity[];

	@ManyToMany(() => UserEntity, (user) => user.channels, { cascade: true })
	@JoinTable()
	bannedUsers: UserEntity[];

	@OneToMany(() => ChatMessageEntity, (message) => message.chat, {
		cascade: true,
	})
	messages: ChatMessageEntity[];

	@Column()
	owner: number;

	@ManyToMany(() => UserEntity, {
		onDelete: "SET NULL",
		cascade: true,
		nullable: true,
	})
	@JoinTable()
	admins: UserEntity[];

	@OneToMany(() => MutedUserEntity, (mute) => mute.target, { cascade: true })
	muted: MutedUserEntity[];
}

@Entity()
export class ChatMessageEntity {
	@PrimaryGeneratedColumn("increment")
	id: number;

	@Column()
	data: string;

	@Column()
	senderId: number;

	@ManyToOne(() => ChatEntity, (chat) => chat.messages)
	chat: ChatEntity;
}

@Entity()
export class MutedUserEntity {
	@PrimaryGeneratedColumn("increment")
	id: number;

	@Column()
	userTargetId: number;

	@Column()
	endDate: number;

	@ManyToOne(() => ChatEntity, (target) => target.muted)
	target: ChatEntity;
}
