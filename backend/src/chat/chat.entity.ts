import { Entity, Column, PrimaryGeneratedColumn, JoinTable, ManyToMany, OneToMany, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import { UserEntity } from "src/user/user.entity";

@Entity()
export class ChatEntity {
	@PrimaryGeneratedColumn('increment')
	id: number;

	@Column()
	password: string;

    @Column()
    name: string;

	@ManyToMany(() => UserEntity, (user) => user.channels , {cascade: true})
	@JoinTable()
	users: UserEntity[];

	@OneToMany(() => ChatMessageEntity, (message) => message.chat, {eager: true, cascade: true})
	messages: ChatMessageEntity[];
}

@Entity()
export class ChatMessageEntity
{
	@PrimaryGeneratedColumn('increment')
	id: number;
	
	@Column()
	data: string;

	@Column()
	senderId: number;

	@ManyToOne(() => ChatEntity, (chat) => chat.messages)
	chat: ChatEntity;
}
