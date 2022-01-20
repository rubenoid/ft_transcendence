import React, { useEffect, useRef, useState } from 'react'
import { PongContainer, PongImg, Button, ButtonContainer, PongCanvas, PlayerContainerTop, PlayerContainerBot, ScoreContainer, ScoreText } from './PongElements'

import  PongImgUrl  from '../../../public/pong.png';
import { User, fetchData } from '../../API/API';
import { Text } from '../Utils/Utils'
import socket from '../socket';

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

class PongRenderer {
	ctx;
	decor: Line[] = [];
	ball: Point;
	ballDir: Point;
	players: Point[] = [];


	constructor(ctx: CanvasRenderingContext2D, decor: Line[]) {
		this.ctx = ctx;
		this.decor = decor;
		this.ball = new Point(180, 180);
		this.players = [new Point(200, 20), new Point(180, 580)];

		this.draw();
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

	drawPlayers()
	{
		this.ctx.fillStyle = "blue";

		this.ctx.fillRect(this.players[0].x, this.players[0].y, 50, 6);
		this.ctx.fillStyle = "red";
		this.ctx.fillRect(this.players[1].x, this.players[1].y, 50, 6);
	}

	drawBall()
	{
		this.ctx.beginPath()
		this.ctx.arc(this.ball.x, this.ball.y, 5, 0, 2 * Math.PI);
		this.ctx.stroke();
	}

	draw()
	{ 
		this.clear();
		this.drawDecor();
		this.drawBall();
		this.drawPlayers();
	}
}

const Pong = () => {

	const canvasRef = useRef(null);
	let renderer: PongRenderer | undefined;

	const lines = [
		new Line(new Point(20, 20), new Point(20, 580) ),
		new Line(new Point(380, 20), new Point(380, 580) ),
	
	];
	let keys = [false, false];

	useEffect(() => {
		const canvas = canvasRef.current
		const context = canvas.getContext('2d')

		document.addEventListener('keydown', function(event) {
			if (event.key.toLocaleLowerCase() == 'a'
            || event.key.toLocaleLowerCase() == 'arrowleft')
				keys[0] = true;
			if (event.key.toLocaleLowerCase() == 'd' 
            || event.key.toLocaleLowerCase() == 'arrowright')
				keys[1] = true;
		});
		
		
		document.addEventListener('keyup', function(event) {
			if (event.key.toLocaleLowerCase() == 'a'
            || event.key.toLocaleLowerCase() == 'arrowleft')
				keys[0] = false;
			if (event.key.toLocaleLowerCase() == 'd'
			|| event.key.toLocaleLowerCase() == 'arrowright')
				keys[1] = false;
		});
		

		renderer = new PongRenderer(context, lines);

		socket.on("gameUpdate", (Data: {positions: Point[], ballpos: Point}) => {
			renderer.players = Data.positions;
			renderer.ball = Data.ballpos;
			renderer.draw();
			if (keys[0] || keys[1])
				socket.emit("positionUpdate", keys);
		});

		socket.on("gameInit", (data: {decor: Line[], players: number[]}) => {
			renderer.decor = data.decor;
			fetchData(`/user/get/${data.players[0]}`).then((player1: User) => {
				console.log("got player 1", player1);
				fetchData(`/user/get/${data.players[1]}`).then((player2: User) => {
					console.log("got player 2");
					setPlayers([player1, player2]);
				});
			}).catch((err) => {
				console.log("ERRROROROOR");
			})
		});

		socket.on("startMatch", () => {
			console.log("STARTING MATCH");
			setDisplay(false);
		});
	
		socket.on("gameFinished", () => {
			console.log("game finished!");
			setDisplay(true);
			setQueue(false);
		});

		socket.on("scoreUpdate", (scores: number[]) => {
			setScores(scores);
		});
  
	}, [])
	
	const [isQueueing, setQueue] = useState<boolean>(false);
	const [displayButton, setDisplay] = useState(true);
	const [scores, setScores] = useState([0, 0]);
	const [players, setPlayers] = useState([undefined, undefined]);
	
	function addToQueue() {

		if (isQueueing)
		{
			socket.emit("removeFromQueue");
		}
		else
		{
			socket.emit("addToQueue");
		}
		setQueue(!isQueueing);
	}

    return (
        <>
            <PongContainer>
				<PlayerContainerTop>
					<ScoreText>{players[0] ? players[0].userName : 'loading'}</ScoreText>
					<ScoreContainer><ScoreText>{scores[0]}</ScoreText></ScoreContainer>
				</PlayerContainerTop>
				<PongCanvas ref={canvasRef} id="canvas" width="400" height="600"></PongCanvas>
				<PlayerContainerBot>
					<ScoreText>{players[1] ? players[1].userName : 'loading'}</ScoreText>
					<ScoreContainer><ScoreText>{scores[1]}</ScoreText></ScoreContainer>
				</PlayerContainerBot>
				<ButtonContainer display={displayButton}>
					<Button><Text fontSize='20px' onClick={addToQueue}>{isQueueing ? 'In Queue' : 'Play Online'}</Text></Button>
				</ButtonContainer>
            </PongContainer>
        </>
    );
}

// import React from 'react';
// const CanvasContext = React.createContext(null);
// export default CanvasContext;

export default Pong;
