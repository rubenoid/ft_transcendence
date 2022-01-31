import React, { useEffect, useState } from "react";
import { fetchData } from "../../API/API";
import socket from "../../API/Socket";
import { User } from "../../Types/Types";
import { Header, Text } from "../Utils/Text/Text";
import { RunningItemWrapper } from "./PongElements";

interface InputParams {
	onSpectateClick(id: string): void;
}

interface RunningGame {
	id: string;
	players: User[];
	score: number[];
}

interface specUpdate {
	isRemove: boolean;
	id: string;
	score: number[];
}

const RunningGamesList = (props: InputParams): JSX.Element => {
	const [runningGames, setRunningGames] = useState<RunningGame[]>([]);

	function update(): void {
		fetchData("/game/running").then((res: RunningGame[]) => {
			setRunningGames(res);
		});
	}

	useEffect(() => {
		update();
		socket.emit("enterSpectatorBooth");
		socket.on("spectateUpdate", update);

		return () => {
			socket.emit("leaveSpectatorBooth");
			socket.off("spectateUpdate");
		};
	}, []);

	const listRunningGames = runningGames.map(
		(game: RunningGame, key: number) => {
			return (
				<RunningItemWrapper
					key={key}
					onClick={() => props.onSpectateClick(game.id)}
				>
					<Text fontSize="25px">
						{game.players[0] != undefined
							? game.players[0].userName + " (" + game.score[0] + ")"
							: "No one"}
						-
						{game.players[1] != undefined
							? " (" + game.score[1] + ") " + game.players[1].userName
							: "No one"}
					</Text>
				</RunningItemWrapper>
			);
		},
	);

	return (
		<div style={{ width: "300px" }}>
			<Header>Running Games</Header>
			<div>
				{runningGames.length ? (
					listRunningGames
				) : (
					<Text>No spectateable games at this time</Text>
				)}
			</div>
		</div>
	);
};

export default RunningGamesList;
