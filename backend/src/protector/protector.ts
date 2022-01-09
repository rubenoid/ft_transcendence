import * as bcrypt from 'bcrypt';

const saltOrRounds = 10;

export class ProtectorService {
	rounds = 10;
	constructor() {}

	async hash(data: string): Promise<string>
	{
		const hash = await bcrypt.hash(data, saltOrRounds);
		return hash;
	}

	async compare(data: string, hash: string) : Promise<boolean>
	{
		const isMatch = await bcrypt.compare(data, hash);
		return isMatch;
	}
}
