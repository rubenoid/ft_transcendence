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
export class AchievementsEntity {
	@PrimaryGeneratedColumn("increment")
	id: number;

	@Column()
	date: number;

	@Column()
	title: string;

	@Column()
	description: string;

	@ManyToOne(() => UserEntity, (target) => target.achievements, { onDelete: "CASCADE" })
	target: UserEntity;
}
