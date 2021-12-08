import { Connection } from 'typeorm';
import { UserEntity } from './user.entity';

export const UserProvider = [
	{
		provide: 'USER_REPOSITORY',
		useFactory: (connection: Connection) =>
			connection.getRepository(UserEntity),
		inject: ['DATABASE_CONNECTION'],
	},
];
