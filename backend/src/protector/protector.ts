// import * as bcrypt from 'bcrypt';

// const password = 'ping_to_pong_charity';
// const saltOrRounds = 10;

// export class Protector {
// 	rounds = 10;
// 	constructor() {}

// 	async hash(data: string): Promise<string>
// 	{
// 		const hash = await bcrypt.hash(password, saltOrRounds);
// 		console.log("typeof hash", typeof hash);
// 		return hash;
// 	}

// 	async compare(data: string, hash: string) : Promise<boolean>
// 	{
// 		const isMatch = await bcrypt.compare(data, hash);
// 		return isMatch;
// 	}
// }
