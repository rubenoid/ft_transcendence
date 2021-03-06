import { Connection, createConnection } from "typeorm";

export const databaseProvider = [
	{
		provide: "DATABASE_CONNECTION",
		useFactory: async (): Promise<Connection> =>
			await createConnection({
				type: "postgres",
				host: "postgres",
				port: 5432,
				username: "postgres",
				password: "codam",
				database: "pongping",
				entities: [__dirname + "/../**/*.entity{.ts,.js}"],
				synchronize: true,
			}),
	},
];
