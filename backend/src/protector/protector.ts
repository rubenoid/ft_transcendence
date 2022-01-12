import * as bcrypt from "bcrypt";

export class ProtectorService {
	rounds = 10;

	async hash(data: string): Promise<string> {
		const hash = await bcrypt.hash(data, this.rounds);
		return hash;
	}

	async compare(data: string, hash: string): Promise<boolean> {
		const isMatch = await bcrypt.compare(data, hash);
		return isMatch;
	}
}
