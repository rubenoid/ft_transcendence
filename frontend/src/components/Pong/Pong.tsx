import React, { useEffect, useRef, useState } from 'react'
import { PongContainer, PongImg, Button, ButtonContainer, PongCanvas } from './PongElements'

import  PongImgUrl  from '../../../public/pong.png';

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

function addToQueue() {
	console.log("in function addToQueue");
	socket.emit("addToQueue");
}

const Pong = () => {
	const canvasRef = useRef(null);
	let renderer: PongRenderer | undefined;
    // const context =canvasRef.getContext('2d');
	// console.log(canvasRef);
	// const [ctx, setCtx] = useState(null);
	// console.log(ctx);

	// useEffect(() => {
	// 	setCtx(canvasRef.current.getContext('2d'));
	// }, [setCtx]);


	const lines = [
		new Line(new Point(20, 20), new Point(20, 580) ),
		new Line(new Point(380, 20), new Point(380, 580) ),
		new Line(new Point(300, 300), new Point(380, 300) ),
	
	];
	let keys = [false, false];

	useEffect(() => {
		const canvas = canvasRef.current
		const context = canvas.getContext('2d')

		document.addEventListener('keydown', function(event) {
			console.log(event.key);
			if (event.key.toLocaleLowerCase() == 'a'
            || event.key.toLocaleLowerCase() == 'arrowleft')
				keys[0] = true;
			if (event.key.toLocaleLowerCase() == 'd' 
            || event.key.toLocaleLowerCase() == 'arrowright')
				keys[1] = true;
			console.log(keys);
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
			console.log(Data);
			renderer.players = Data.positions;
			renderer.ball = Data.ballpos;
			console.log("drawing again ", Data);
			renderer.draw();
			if (keys[0] || keys[1])
				socket.emit("positionUpdate", keys);
		});
  
	}, [])
	
	// const canvas: HTMLCanvasElement = document.querySelector("#canvas");
	// const ctx = canvas.getContext("2d");
	
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
			console.log("Drawing decor haha");
		}

		drawPlayers()
		{
			this.ctx.fillStyle = "blue";
	
			this.ctx.fillRect(this.players[0].x, this.players[0].y, 50, 6);
			this.ctx.fillStyle = "red";
			this.ctx.fillRect(this.players[1].x, this.players[1].y, 50, 6);
			console.log("Drawing players haha");
		}

		drawBall()
		{
			this.ctx.beginPath()
			this.ctx.arc(this.ball.x, this.ball.y, 5, 0, 2 * Math.PI);
			this.ctx.stroke();
			console.log("Drawing balls haha");
		}

		draw()
		{ 
			this.clear();
			this.drawDecor();
			this.drawBall();
			this.drawPlayers();
		}
    }
	const [displayButton, setDisplay] = 	useState(true);

	function changeDisplay() {
		setDisplay(false);
	}

	socket.on("startMatch", () => {
		console.log("STARTING MATCH");
		changeDisplay();
	})

    // let displayStyle = true;
    
    // socket.on("startMatch", () => {

    // console.log("STARTING MATCH");
	// displayStyle = false;
	// }) 
// style={{display: this.state.showStore ? 'block' : 'none' }}

    return (
        <>
            <PongContainer>
				<PongCanvas ref={canvasRef} id="canvas" width="400" height="600"></PongCanvas>
				<ButtonContainer display={displayButton}>
					<Button><Text fontSize='20px' onClick={addToQueue}>Play Online</Text></Button>
				</ButtonContainer>
            </PongContainer>
        </>
    );
}

// import React from 'react';
// const CanvasContext = React.createContext(null);
// export default CanvasContext;

export default Pong;
