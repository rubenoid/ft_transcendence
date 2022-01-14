import { Server, Socket } from "socket.io";
import { GameService } from "./game.service";
import { GuardedSocket } from "src/overloaded";

export class Point {
	x;
	y;
	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}
}

export class Line {
	p1;
	p2;
	constructor(p1: Point, p2: Point) {
		this.p1 = p1;
		this.p2 = p2;
	}
}

function intersect(ball: Point, line: Line) {
	if (line.p1.y == line.p2.y) {
		if (ball.x + 5 < line.p1.x) return false;
		if (ball.x - 5 > line.p2.x) return false;
		if (ball.y - 5 <= line.p1.y && ball.y + 5 >= line.p1.y) {
			return true;
		}
		return false;
	} else {
		if (ball.y + 5 < line.p1.y) return false;
		if (ball.y - 5 > line.p2.y) return false;
		if (ball.x - 5 <= line.p1.x && ball.x + 5 >= line.p1.x) return true;
		return false;
	}
}

export class RunningGame {
	interval: NodeJS.Timer;
	players: GuardedSocket[] = [];
	score = [0, 0];

	decor: Line[] = [];
	ball: Point;
	ballDir: Point;

	lastTime = 0;
	deltaTime = 0;

	roomId: string;
	playersPos: Point[] = [];
	server: Server;
	service: GameService;

	constructor(
		players: GuardedSocket[],
		decor: Line[],
		roomid: string,
		server: Server,
		serviceRef: GameService,
	) {
		if (!players || !decor || !roomid || !server || !serviceRef) {
			throw "idk runninggame crashed";
		}
		this.server = server;
		this.roomId = roomid;
		this.players = players;
		this.decor = decor;
		this.ball = new Point(180, 180);
		this.ballDir = new Point(-1, -1);
		this.playersPos = [new Point(200, 20), new Point(200, 580)];
		this.service = serviceRef;

		this.server.to(this.roomId).emit("gameInit", {
			decor: this.decor,
			players: [this.players[0].user.id, this.players[1].user.id],
		});
		this.run();
	}

	moveSpeed = 100;
	calculate(): void {
		const oldpos = new Point(this.ball.x, this.ball.y);
		this.ball.x += this.ballDir.x * this.moveSpeed * this.deltaTime;
		this.ball.y += this.ballDir.y * this.moveSpeed * this.deltaTime;

		if (this.ball.y < 0 || this.ball.y > 600) {
			if (this.ball.y < 0) {
				this.score[1]++;
			} else {
				this.score[0]++;
			}
			this.server.to(this.roomId).emit("scoreUpdate", this.score);
			this.ball = new Point(200, 300);
			this.moveSpeed = 100;
			let newRandAng = Math.random() * 45 + 45;
			if (Math.random() > 0.5) newRandAng += 180;
			this.ballDir.x = Math.cos(newRandAng * 0.0174532925);
			this.ballDir.y = Math.sin(newRandAng * 0.0174532925);
		}

		const toCheck = new Point(this.ball.x, this.ball.y);
		if (this.ballDir.x > 0) toCheck.x += 2.5;
		else toCheck.x -= 2.5;
		if (this.ballDir.y > 0) toCheck.y += 2.5;
		else toCheck.y -= 2.5;

		const player1End = new Point(
			this.playersPos[0].x + 50,
			this.playersPos[0].y + 6,
		);
		const player2End = new Point(
			this.playersPos[1].x + 50,
			this.playersPos[1].y,
		);
		const randomDev = Math.random() * 0.25;
		this.decor.push(
			new Line(
				new Point(this.playersPos[0].x, this.playersPos[0].y + 6),
				player1End,
			),
		);
		this.decor.push(new Line(this.playersPos[1], player2End));
		for (let i = 0; i < this.decor.length; i++) {
			const e = this.decor[i];
			if (intersect(toCheck, e)) {
				if (this.moveSpeed < 200) this.moveSpeed *= 1.2;
				if (e.p1.y < e.p2.y) this.ballDir.x = -this.ballDir.x + randomDev;
				else this.ballDir.y = -this.ballDir.y + randomDev;
				this.ball.x += this.ballDir.x * this.moveSpeed * this.deltaTime;
				this.ball.y += this.ballDir.y * this.moveSpeed * this.deltaTime;
			}
		}
		this.decor.pop();
		this.decor.pop();
	}

	emit(): void {
		this.server.to(this.roomId).emit("gameUpdate", {
			positions: this.playersPos,
			ballpos: this.ball,
		});
	}

	run(): void {
		const counter = 0;
		this.lastTime = Date.now();
		this.deltaTime = 0;
		this.interval = setInterval(() => {
			if (this.score[0] > 1 || this.score[1] > 1) {
				clearInterval(this.interval);
				this.server.to(this.roomId).emit("gameFinished");
				this.service.handleFinishedGame(this);
				return;
			}
			this.deltaTime = (Date.now() - this.lastTime) / 1000;
			this.calculate();
			this.emit();
			this.lastTime = Date.now();
		}, 1000 / 60);
	}

	async updatePos(keys: boolean[], player: number): Promise<void> {
		const playerref = player == 1 ? this.playersPos[0] : this.playersPos[1];

		if (keys[0]) {
			playerref.x -= 200 * this.deltaTime;
			if (playerref.x < 20 + 1) playerref.x = 20 + 1;
		}
		if (keys[1]) {
			playerref.x += 200 * this.deltaTime;
			if (playerref.x + 50 > 380 - 1) playerref.x = 380 - 50 - 1;
		}
	}
}
