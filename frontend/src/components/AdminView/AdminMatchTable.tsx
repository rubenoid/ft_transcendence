import React from "react";
import { Text } from "../Utils/Text/Text";
import {
	TableRow,
	AdminTableCell,
	TableHeader,
	AdminTableHeader,
	AdminTable,
} from "../Utils/Table/Table";
import { Match } from "../../Types/Types";
import { Label } from "../ConnectionForm/ConnectionFormElements";

interface InputParams {
	matches: Match[];
}

const AdminMatchTable = (props: InputParams): JSX.Element => {
	const matchlist = props.matches.map((matches: Match, key: number) => {
		return (
			<TableRow key={key}>
				<AdminTableCell>
					<Text fontSize="10" color="black">
						{matches.id}
					</Text>
				</AdminTableCell>
				<AdminTableCell>
					<Text fontSize="10" color="black">
						{matches.players[0].userName}
					</Text>
				</AdminTableCell>
				<AdminTableCell>
					{matches.players[1] ? (
						<Text fontSize="10" color="black">
							{matches.players[1].userName}
						</Text>
					) : (
						<Text color="black">NA</Text>
					)}
				</AdminTableCell>
				<AdminTableCell>
					<Text fontSize="10" color="black">
						{matches.scorePlayer1}
					</Text>
				</AdminTableCell>
				<AdminTableCell>
					<Text fontSize="10" color="black">
						{matches.scorePlayer2}
					</Text>
				</AdminTableCell>
			</TableRow>
		);
	});
	return (
		<>
			<Label>
				<Text fontSize="20px" color="black">
					Matches
				</Text>
			</Label>
			<AdminTable>
				<TableHeader>
					<TableRow>
						<AdminTableHeader>id</AdminTableHeader>
						<AdminTableHeader>Player 1</AdminTableHeader>
						<AdminTableHeader>Player 2</AdminTableHeader>
						<AdminTableHeader>Score P1</AdminTableHeader>
						<AdminTableHeader>Score P2</AdminTableHeader>
					</TableRow>
				</TableHeader>
				<tbody>{props.matches ? matchlist : null}</tbody>
			</AdminTable>
		</>
	);
};

export default AdminMatchTable;
