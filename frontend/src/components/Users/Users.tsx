import React, { useState, useEffect } from "react";
import { WidgetContainer } from "../Utils/Containers/Containers";
import {
	Table,
	TableHeaderCell,
	TableBody,
	TableRow,
	TableHeader,
	TableCell,
} from "../Utils/Table/Table";
import socket from "../../API/Socket";
import { Text } from "../Utils/Text/Text";
import { detailedUser, userStatus } from "../../Types/Types";
import { getFoundUsers, updateUserStatus } from "./UsersUtils";

function getUsersTableRows(users: detailedUser[]): JSX.Element[] {
	const rows = [];
	for (let i = 0; i < users.length; i++) {
		rows.push(
			<TableRow key={i}>
				<TableCell>
					<Text fontSize="10">{users[i].id}</Text>
				</TableCell>
				<TableCell>
					<Text fontSize="10">{users[i].userName}</Text>
				</TableCell>
				<TableCell>
					<Text fontSize="10">{users[i].wins}</Text>
				</TableCell>
				<TableCell>
					<Text fontSize="10">{users[i].losses}</Text>
				</TableCell>
				<TableCell>
					<Text fontSize="10">
						{users[i].status ? users[i].status : "Offline"}
					</Text>
				</TableCell>
			</TableRow>,
		);
	}
	return rows;
}

function getTableHeader(): JSX.Element {
	return (
		<TableHeader>
			<TableRow>
				<TableHeaderCell>id</TableHeaderCell>
				<TableHeaderCell>username</TableHeaderCell>
				<TableHeaderCell>wins</TableHeaderCell>
				<TableHeaderCell>losses</TableHeaderCell>
				<TableHeaderCell>Status</TableHeaderCell>
			</TableRow>
		</TableHeader>
	);
}

const Users = (): JSX.Element => {
	const [usersTableRows, setUsersTableRows] = useState(undefined);
	let users: detailedUser[] = [];

	useEffect(() => {
		async function getUsers(): Promise<void> {
			users = await getFoundUsers();
			updateUsersTableRows();
		}
		getUsers();
	}, [users]);

	useEffect(() => {
		socket.on("userUpdate", (status: userStatus) => {
			if (updateUserStatus(users, status)) updateUsersTableRows();
		});
	}, []);

	function updateUsersTableRows(): void {
		const rows = getUsersTableRows(users);
		setUsersTableRows(rows);
	}

	return (
		<WidgetContainer>
			<Text>Users</Text>
			<Table>
				{getTableHeader()}
				<TableBody>{usersTableRows ? usersTableRows : null}</TableBody>
			</Table>
		</WidgetContainer>
	);
};

export default Users;
