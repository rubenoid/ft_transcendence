import { Controller, Get, Param } from '@nestjs/common';
import { MatchEntity } from './match.entity';
import { MatchService } from './match.service';

@Controller('match')
export class MatchController {
	constructor (private readonly matchService: MatchService) {}
	@Get('newMatch/:id1/:id2')
	async newMatch(@Param() param)
	{
		return await this.matchService.newMatch(param.id1 as number, param.id2 as number);
	}

	@Get('addPlayerToQueue/:id')
	async addPlayerToQue(@Param() param)
	{
		return await this.matchService.addPlayerToQue(param.id as number);
	}

	@Get('increaseScore/:matchid/:playerid')
	async increaseScore(@Param() param)
	{
		return await this.matchService.increaseScore(param.matchid as number, param.playerid as number);
	}

	@Get('getMatch/:id')
	async getMatch(@Param() param)
	{
		return await this.matchService.getMatch(param.id as number);
	}

	@Get("getUserHistory/:id")
	async getUserHistory(@Param() param)
	{
		return await this.matchService.getUserMatches(param.id as number);
	}

	@Get('getAllMatchs')
	async getAllMatchs()
	{
		return await this.matchService.getAllMatches();
	}
	@Get('getQueuedPlayer')
	async getQueuedPlayer()
	{
		return await this.matchService.getQueuedPlayer();
	}
}
