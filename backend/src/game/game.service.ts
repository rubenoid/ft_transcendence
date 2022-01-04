import { Injectable } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { UserEntity } from 'src/user/user.entity';

class Point {
	x;
	y;
	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;	
	}
}

class Line {
	p1;
	p2;
	constructor(p1: Point, p2: Point) {
		this.p1 = p1;
		this.p2 = p2;
	}
}

function ccw(A: Point, B: Point, C: Point)
{
	return (C.y - A.y) * (B.x - A.x) > (B.y -A.y) * (C.x - A.x);
}

function intersect(p1: Point, p2: Point, p3: Point, p4: Point)
{
	return (ccw(p1, p3, p4) != ccw(p2, p3, p4) && ccw(p1, p2, p3) != ccw(p1, p2, p4));	
}

class RunningGame
{
	interval: NodeJS.Timer;
	players:Socket[] = [];
	score = [0, 0];

	decor: Line[] = [];
	ball: Point;
	ballDir: Point;

	lastTime: number = 0;
	deltaTime: number = 0;

	roomId: string;
	playersPos: Point[] = [];
	server: Server;

	constructor (players: Socket[], decor: Line[], roomid: string, server: Server)
	{
		this.server = server;
		this.roomId = roomid;
		this.players = players;
		this.decor = decor;
		this.ball = new Point(180, 180);
		this.ballDir = new Point(-1, -1);
		this.playersPos = [new Point(200, 20), new Point(200, 580)];
		
		this.run();
	}

	moveSpeed = 100;
	calculate() {
		let oldpos = new Point(this.ball.x, this.ball.y);
		this.ball.x += this.ballDir.x * this.moveSpeed * this.deltaTime;
		this.ball.y += this.ballDir.y * this.moveSpeed * this.deltaTime;

		if (this.ball.y < 0 || this.ball.y > 600)
		{
			this.ball = new Point(200, 300);
			this.moveSpeed = 100;
			let newRandAng = (Math.random() * 45) + 45;
			if (Math.random() > 0.5)
				newRandAng += 180;
			this.ballDir.x = Math.cos(newRandAng * 0.0174532925);
			this.ballDir.y = Math.sin(newRandAng * 0.0174532925);
		}

		let toCheck = new Point(this.ball.x, this.ball.y);
		if (this.ballDir.x > 0)
			toCheck.x += 2.5;
		else
			toCheck.x -= 2.5;
		if (this.ballDir.y > 0)
			toCheck.y += 2.5;
		else
			toCheck.y -= 2.5;

		let player1_end = new Point(this.playersPos[0].x + 50, this.playersPos[0].y + 6);
		let player2_end = new Point(this.playersPos[1].x + 50, this.playersPos[1].y);
		const randomDev = Math.random() * 0.25;
		this.decor.push(new Line(new Point(this.playersPos[0].x, this.playersPos[0].y + 6), player1_end));
		this.decor.push(new Line(this.playersPos[1], player2_end));
		for (let i = 0; i < this.decor.length; i++) {
			const e = this.decor[i];
			if (intersect(oldpos, toCheck, e.p1, e.p2))
			{
				if (this.moveSpeed < 200)
					this.moveSpeed *= 1.2;
				if (e.p1.y < e.p2.y)
					this.ballDir.x = -this.ballDir.x + randomDev;
				else
					this.ballDir.y = -this.ballDir.y + randomDev;
				this.ball.x += (this.ballDir.x * this.moveSpeed * this.deltaTime) ;
				this.ball.y += (this.ballDir.y * this.moveSpeed * this.deltaTime) ;
			}
		}
		this.decor.pop();
		this.decor.pop();
	}

	emit()
	{
		this.server.to(this.roomId).emit("gameUpdate",
		{
			positions: this.playersPos,
			ballpos: this.ball,
		}
		);
	}

	run()
	{
		let counter = 0;
		this.lastTime = Date.now();
		this.deltaTime = 0;
		this.interval = setInterval(() => {
			if (this.score[0] > 5 || this.score[1] > 5 || counter > 1000)
			{
				clearInterval(this.interval);
			}
			this.deltaTime = (Date.now() - this.lastTime) / 1000;
			this.calculate();
			this.emit();
			counter++;
			this.lastTime = Date.now();
		}, 1000/60);


	}

	async updatePos(keys: boolean[], player: number)
	{
		const playerref = player == 1 ? this.playersPos[0] : this.playersPos[1];

		if (keys[0])
		{
			playerref.x -= 200 * this.deltaTime;
			if (playerref.x < 20 + 1)
				playerref.x  = 20 + 1;
		}
		if (keys[1])
		{
			playerref.x  += 200 * this.deltaTime;
			if (playerref.x  + 50 > 380 - 1)
				playerref.x  = 380 - 50 - 1;
		}		
	}
}

@Injectable()
export class GameService {
	games: RunningGame[] = [];

	decor: Line[] = [
		new Line(new Point(20, 20), new Point(20, 580) ),
		new Line(new Point(380, 20), new Point(380, 580) )
		]
	searchingtmp: Socket[] = [];

	startMatch(client1: Socket, client2: Socket, server: Server)
	{
		console.log("in start match");
		console.log("adding" + client1.id + " and " + client2.id);
		let roomid = 'runningGame' + this.games.length;

		client1.join(roomid);
		client2.join(roomid);

		this.games.push(new RunningGame( [client1, client2], this.decor, roomid, server ));
		server.to(roomid).emit("startMatch");
	}

	async handlePositionUpdate(client: Socket, keys: boolean[])
	{
		console.log("handlePositionUpdate: keys",keys);
		console.log("handlePositionUpdate: clientid",client.id);
		const game = this.games.find(x => x.players[0].id == client.id || x.players[1].id == client.id);
		if (game != undefined)
		{
			console.log("FOUND GAME");
			game.updatePos(keys, game.players[1].id == client.id ? 1 : 0);
		}
	}
}
