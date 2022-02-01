import React, { useEffect, useRef, useState } from "react";
import {
	PongContainer,
	Button,
	ButtonContainer,
	PongCanvas,
	PlayerContainerTop,
	PlayerContainerBot,
	ScoreContainer,
	ScoreText,
	FinishedContainer,
} from "./PongElements";

import { fetchData } from "../../API/API";
import { Header, Text } from "../Utils/Text/Text";
import socket from "../../API/Socket";
import { useNavigate, useParams } from "react-router-dom";
import { User } from "../../Types/Types";

enum GameStatus {
	base,
	finished,
	inviteWait,
	ingame,
	queuing,
}

interface fetchedGameData {
	running: boolean;
	scores: number[];
	players: number[];
}

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

	clear(): void {
		this.ctx.fillStyle = "black";
		this.ctx.fillRect(0, 0, 400, 600);
	}

	drawDecor(): void {
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

	drawPlayers(): void {
		this.ctx.fillStyle = "blue";

		this.ctx.fillRect(this.players[0].x, this.players[0].y, 50, 6);
		this.ctx.fillStyle = "red";
		this.ctx.fillRect(this.players[1].x, this.players[1].y, 50, 6);
	}

	drawBall(): void {
		this.ctx.beginPath();
		this.ctx.arc(this.ball.x, this.ball.y, 5, 0, 2 * Math.PI);
		this.ctx.stroke();
	}

	draw(): void {
		this.clear();
		this.drawDecor();
		this.drawBall();
		this.drawPlayers();
	}
}

const Pong = (): JSX.Element => {
	const canvasRef = useRef(null);
	const [isQueueing, setQueue] = useState<boolean>(false);
	const [displayStatus, setDisplay] = useState(GameStatus.base);
	const [scores, setScores] = useState([0, 0]);
	const [players, setPlayers] = useState([undefined, undefined]);
	const [inviteLink, setInviteLink] = useState<string>(undefined);

	const { gameId } = useParams();
	const navigate = useNavigate();

	const keys = [false, false];

	useEffect(() => {
		const canvas = canvasRef.current;
		const context = canvas.getContext("2d");
		const renderer: PongRenderer | undefined = new PongRenderer(context, []);

		function handleKeyDown(event: KeyboardEvent): void {
			if (
				event.key.toLocaleLowerCase() == "a" ||
				event.key.toLocaleLowerCase() == "arrowleft"
			)
				keys[0] = true;
			if (
				event.key.toLocaleLowerCase() == "d" ||
				event.key.toLocaleLowerCase() == "arrowright"
			)
				keys[1] = true;
		}

		function handleKeyUp(event: KeyboardEvent): void {
			if (
				event.key.toLocaleLowerCase() == "a" ||
				event.key.toLocaleLowerCase() == "arrowleft"
			)
				keys[0] = false;
			if (
				event.key.toLocaleLowerCase() == "d" ||
				event.key.toLocaleLowerCase() == "arrowright"
			)
				keys[1] = false;
		}

		document.addEventListener("keydown", handleKeyDown, true);

		document.addEventListener("keyup", handleKeyUp, true);

		socket.on("gameUpdate", (Data: { positions: Point[]; ballpos: Point }) => {
			renderer.players = Data.positions;
			renderer.ball = Data.ballpos;
			renderer.draw();
			if (keys[0] || keys[1]) socket.emit("positionUpdate", keys);
		});

		socket.on("gameInit", (data: { decor: Line[]; players: number[] }) => {
			renderer.decor = data.decor;
			fetchData(`/user/get/${data.players[0]}`)
				.then((player1: User) => {
					fetchData(`/user/get/${data.players[1]}`).then((player2: User) => {
						setPlayers([player1, player2]);
					});
				})
				.catch((err) => {
					console.log(err);
				});
		});

		socket.on("startMatch", (gameId: string) => {
			navigate(`/game/${gameId}`);
			setDisplay(GameStatus.ingame);
		});

		socket.on("gameFinished", () => {
			setDisplay(GameStatus.finished);
			setQueue(false);
		});

		socket.on("scoreUpdate", (scores: number[]) => {
			setScores(scores);
		});

		return () => {
			setPlayers([]);
			setScores([0, 0]);
			renderer.clear();
			socket.emit("leaveGame", gameId);
			socket.off("startMatch");
			socket.off("gameFinished");
			socket.off("scoreUpdate");
			socket.off("gameInit");
			socket.off("gameUpdate");
			document.removeEventListener("keydown", handleKeyDown, true);
			document.removeEventListener("keyup", handleKeyUp, true);
		};
	}, [gameId]);

	useEffect(() => {
		return () => {
			console.log(inviteLink, displayStatus);
			if (GameStatus.inviteWait == displayStatus) {
				console.log(inviteLink);
				socket.emit("leaveInvite", inviteLink);
			}
		};
	}, [inviteLink, displayStatus]);

	useEffect(() => {
		async function loadGame(): Promise<void> {
			fetchData(`/game/getDetails/${gameId}`)
				.then(async (data: fetchedGameData) => {
					const players: User[] = [];
					if (data.players[0])
						players.push(await fetchData(`/user/get/${data.players[0]}`));
					if (data.players[1])
						players.push(await fetchData(`/user/get/${data.players[1]}`));

					setPlayers(players);
					setScores(data.scores);
					if (!data.running) setDisplay(GameStatus.finished);
					else {
						socket.emit("joinGame", gameId);
						setDisplay(GameStatus.ingame);
					}
				})
				.catch(() => {
					setPlayers([]);
					setScores([0, 0]);
					setDisplay(GameStatus.base);
					return;
				});
		}

		if (gameId === undefined) {
			setDisplay(GameStatus.base);
			return;
		} else loadGame();
	}, [gameId]);

	function addToQueue(): void {
		if (isQueueing) {
			socket.emit("removeFromQueue");
			setDisplay(GameStatus.base);
		} else {
			socket.emit("addToQueue");
			setDisplay(GameStatus.queuing);
		}
		setQueue(!isQueueing);
	}

	async function createLinkGame(): Promise<void> {
		socket.emit("createNewGame", (data: string) => {
			setInviteLink(data);
			setDisplay(GameStatus.inviteWait);
		});
	}

	return (
		<>
			<PongContainer>
				<PlayerContainerTop>
					<ScoreText>{players[0] ? players[0].userName : "loading"}</ScoreText>
					<ScoreContainer>
						<ScoreText>{scores[0]}</ScoreText>
					</ScoreContainer>
				</PlayerContainerTop>
				<PongCanvas
					ref={canvasRef}
					id="canvas"
					width="400"
					height="600"
				></PongCanvas>
				<PlayerContainerBot>
					<ScoreText>{players[1] ? players[1].userName : "loading"}</ScoreText>
					<ScoreContainer>
						<ScoreText>{scores[1]}</ScoreText>
					</ScoreContainer>
				</PlayerContainerBot>

				{displayStatus == GameStatus.finished ? (
					<FinishedContainer>
						<Text fontSize="20px">Game Finished!</Text>
						<Text fontSize="20px">
							{scores[0]} - {scores[1]}
						</Text>
						<Button onClick={() => setDisplay(GameStatus.base)}>Back</Button>
					</FinishedContainer>
				) : displayStatus == GameStatus.base ? (
					<ButtonContainer>
						<Button onClick={addToQueue}>
							<Text fontSize="15px">Play Online</Text>
						</Button>
						<Button onClick={createLinkGame}>
							<Text fontSize="15px">Create a link</Text>
						</Button>
					</ButtonContainer>
				) : displayStatus == GameStatus.inviteWait ? (
					<FinishedContainer>
						<Header>Created a lobby!</Header>
						<Text fontSize="15px">http://localhost:8080/game/{inviteLink}</Text>
						<Text>Waiting for players</Text>
						<Button onClick={() => setDisplay(GameStatus.base)}>
							<Text fontSize="15px">Back</Text>
						</Button>
					</FinishedContainer>
				) : displayStatus == GameStatus.queuing ? (
					<ButtonContainer>
						<Header>In Queue</Header>
						<Button onClick={addToQueue}>
							<Text fontSize="15px">Cancel</Text>
						</Button>
					</ButtonContainer>
				) : (
					""
				)}
			</PongContainer>
		</>
	);
};

export default Pong;
