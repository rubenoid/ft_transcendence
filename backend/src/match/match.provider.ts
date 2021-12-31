import { Connection } from 'typeorm';
import { MatchEntity } from './match.entity';

export const MatchProvider = [
	{
		provide: 'MATCH_REPOSITORY',
		useFactory: (connection: Connection) =>
			connection.getRepository(MatchEntity),
		inject: ['DATABASE_CONNECTION'],
	},
];