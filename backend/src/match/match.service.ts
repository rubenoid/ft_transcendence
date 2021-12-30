import { Injectable, Inject, Post } from '@nestjs/common';
import { MatchEntity } from './match.entity';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';

var quedplayer: UserEntity;

@Injectable()
export class MatchService {
    constructor (
		@Inject('MATCH_REPOSITORY')
		private MatchRepository: Repository<MatchEntity>,
        private userService: UserService
        ) {}

    async newMatch(Playerid1: number, Playerid2: number)
    {
        var User1 = await this.userService.getUserQueryOne({ where: { id: Playerid1 } });
        if (!User1)
            throw "User one not found";
        var User2 = await this.userService.getUserQueryOne({ where: { id: Playerid2 } });
        if (!User2)
            throw "User one not found";  
        var newMatch: MatchEntity = new MatchEntity();
        newMatch.player1 = User1;
        newMatch.player2 = User2;
        newMatch.scorePlayer1 = 0;
        newMatch.scorePlayer2 = 0;
		await this.MatchRepository.save(newMatch);
        return ("Match created between" + newMatch.player1.id + "and" + newMatch.player2.id);
    }

    async addPlayerToQue(Playerid: number)
    {
        var User = await this.userService.getUserQueryOne({ where: { id: Playerid } });
        if (!User)
            throw "User one not found";
        if (!quedplayer)
        {
            quedplayer = User;
            return ("playerr" + User.id + "qued");
        }
        if (quedplayer.id === User.id)
            return ("player" + User.id + "cannot play a match against themselves");
        var Qid = quedplayer.id;
        quedplayer = null;
        return this.newMatch(Qid, User.id);
    }

    async increaseScore(Matchid: number, Playerid: number)
    {
        var Match = await this.MatchRepository.findOne({ where: { id: Matchid } });
        if (!Match)
            throw "No match found";
        if (Playerid === Match.player1.id)
            Match.scorePlayer1++;
        else if (Playerid === Match.player2.id)
            Match.scorePlayer2++;
        else
            throw "No player with id " + Playerid + " in match " +  Matchid;
		await this.MatchRepository.save(Match);
    }
    async getMatch(id: number)
    {
		const Match = await this.MatchRepository.findOne({where: {id: id}, relations: ["player1", "player2"]});
		if (Match === undefined)
			throw "Match not found";
		return Match;
    }

    async getAllMatchs()
    {
		const Match = await this.MatchRepository.find({relations: ["player1", "player2"]});
		if (Match.length === 0)
			throw "user not found";
		return Match;
    }

}
