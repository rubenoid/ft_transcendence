console.log("xd");

const canvas = <HTMLCanvasElement>document.querySelector("#canvas");
const ctx = canvas.getContext("2d");

let pong: Pong | undefined = undefined;

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

var keys: boolean[] = [false, false, false];

function ccw(A: Point, B: Point, C: Point)
{
	return (C.y - A.y) * (B.x - A.x) > (B.y -A.y) * (C.x - A.x);
}

function intersect(p1: Point, p2: Point, p3: Point, p4: Point)
{
	return (ccw(p1, p3, p4) != ccw(p2, p3, p4) && ccw(p1, p2, p3) != ccw(p1, p2, p4));	
}

class Pong {
	interval: NodeJS.Timer | undefined;
	ctx;
	decor: Line[] = [];
	ball: Point;
	ballDir: Point;

	lastTime: number = 0;
	deltaTime: number = 0;

	players: Point[] = [];
	constructor(ctx: CanvasRenderingContext2D, decor: Line[]) {
		this.ctx = ctx;
		this.decor = decor;
		this.ball = new Point(180, 180);
		this.ballDir = new Point(-1, -1);
		this.players = [new Point(200, 20), new Point(180, 580)];
	}

	clear()
	{
		this.ctx.fillStyle = "black";
		this.ctx.fillRect(0,0,400,600);
	}

	drawDecor()
	{
		for (let i = 0; i < this.decor.length; i++) {
			const e = this.decor[i];
			this.ctx.strokeStyle = "white";
			this.ctx.lineWidth = 2;
			this.ctx.beginPath();
			this.ctx.moveTo(e.p1.x, e.p1.y);
			this.ctx.lineTo(e.p2.x, e.p2.y);
			this.ctx.stroke();
		}
	}

	moveSpeed = 100;
	renderBall() {
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

		let player1_end = new Point(this.players[0].x + 50, this.players[0].y + 6);
		let player2_end = new Point(this.players[1].x + 50, this.players[1].y);
		const randomDev = Math.random() * 0.25;
		this.decor.push(new Line(new Point(this.players[0].x, this.players[0].y + 6), player1_end));
		this.decor.push(new Line(this.players[1], player2_end));
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

	drawBall()
	{
		this.ctx.beginPath()
		this.ctx.arc(this.ball.x, this.ball.y, 5, 0, 2 * Math.PI);
		this.ctx.stroke();
	}

	drawPlayers()
	{
		this.ctx.fillStyle = "blue";

		this.ctx.fillRect(this.players[0].x, this.players[0].y, 50, 6);
		this.ctx.fillStyle = "red";
		this.ctx.fillRect(this.players[1].x, this.players[1].y, 50, 6);
	}

	draw()
	{
		this.drawDecor();
		this.renderBall();
		this.drawBall();
		this.drawPlayers();

	}

	run()
	{
		this.lastTime = Date.now();
		this.deltaTime = 0;
		this.interval = setInterval(() => {
			this.deltaTime = (Date.now() - this.lastTime) / 1000;
			if (keys[0])
			{
				this.players[0].x -= 200 * this.deltaTime;
				if (this.players[0].x < 20 + 1)
					this.players[0].x = 20 + 1;
			}
			if (keys[1])
			{
				this.players[0].x += 200 * this.deltaTime;
				if (this.players[0].x + 50 > 380 - 1)
					this.players[0].x = 380 - 50 - 1;
			}
			this.clear();
			this.draw();
			this.lastTime = Date.now();
		}, 1000/60)
	}
}

document.addEventListener('keydown', function(event) {
	console.log(event.key);
	if (event.key.toLocaleLowerCase() == 'a')
		keys[0] = true;
	if (event.key.toLocaleLowerCase() == 'd')
		keys[1] = true;
});


document.addEventListener('keyup', function(event) {
	if (event.key.toLocaleLowerCase() == 'a')
		keys[0] = false;
	if (event.key.toLocaleLowerCase() == 'd')
		keys[1] = false;
	if (event.shiftKey)
		keys[2] = false;
});


if (ctx)
{
	const lines = [
		new Line(new Point(20, 20), new Point(20, 580) ),
		new Line(new Point(380, 20), new Point(380, 580) ),

	]
	pong = new Pong(ctx, lines);
	pong.run();

}