import React from "react";
import { detailedUser, Match } from "../../Types/Types";
import {
	TableRow,
	TableCell,
	TableHeader,
	TableHeaderCell,
	Table,
} from "../Utils/Table/Table";
import { Link } from "react-router-dom";
import { Text } from "../Utils/Text/Text";

interface InputParams {
	user: detailedUser;
}

const ListMatch = (props: InputParams): JSX.Element => {
	const listmatches = props.user.matches.map((value: Match, key: number) => {
		return (
			<TableRow key={key}>
				{value.players[0].userName == props.user.userName &&
				value.players[1] ? (
					<TableCell>
						<Link to={`/profile/${value.players[1].id}`}>
							<Text fontSize="10">{value.players[1].userName}</Text>
						</Link>
					</TableCell>
				) : (
					<TableCell>
						<Link to={`/profile/${value.players[0].id}`}>
							<Text fontSize="10">{value.players[0].userName}</Text>
						</Link>
					</TableCell>
				)}
				<TableCell>
					{value.players[0].userName == props.user.userName ? (
						<Text fontSize="10">{value.scorePlayer1}</Text>
					) : (
						<Text fontSize="10">{value.scorePlayer2}</Text>
					)}
				</TableCell>
				<TableCell>
					{value.players[0].userName == props.user.userName ? (
						<Text fontSize="10">{value.scorePlayer2}</Text>
					) : (
						<Text fontSize="10">{value.scorePlayer1}</Text>
					)}
				</TableCell>
			</TableRow>
		);
	});

	return (
		<>
			{props.user.matches.length ? (
				<Table>
					<TableHeader>
						<TableRow>
							<TableHeaderCell>Played Against</TableHeaderCell>
							<TableHeaderCell>
								{props.user.userName}
								{"'"}s score
							</TableHeaderCell>
							<TableHeaderCell>Other player Score</TableHeaderCell>
						</TableRow>
					</TableHeader>
					<tbody>{listmatches}</tbody>
				</Table>
			) : (
				<Text>No matches yet</Text>
			)}
		</>
	);
};

export default ListMatch;
