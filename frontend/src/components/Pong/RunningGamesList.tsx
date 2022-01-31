import React, { useEffect, useState } from "react";
import { fetchData } from "../../API/API";
import { User } from "../../Types/Types";
import { Header, Text } from "../Utils/Text/Text";
import { RunningItemWrapper } from "./PongElements";

interface InputParams {
	onSpectateClick(id: number): void;
}

interface RunningGame {
	id: string;
	players: User[];
	score: number[];
}

const RunningGamesList = (props: InputParams): JSX.Element => {
	const [runningGames, setRunningGames] = useState<RunningGame[]>([]);

	useEffect(() => {
		fetchData("/game/running").then((res: RunningGame[]) => {
			setRunningGames(res);
		});
	}, []);

	const listRunningGames = runningGames.map(
		(game: RunningGame, key: number) => {
			return (
				<RunningItemWrapper key={key}>
					<Text fontSize="25px">
						{game.players[0].userName} ({game.score[0]}) - ({game.score[1]}){" "}
						{game.players[1].userName}
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
