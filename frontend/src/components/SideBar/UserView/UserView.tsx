import React, { useState, useEffect } from "react";
import { User } from "../../../Types/Types";
import socket from "../../../API/Socket";
import {
	Table,
	TableBody,
	TableCell,
	TableHeader,
	TableHeaderCell,
	TableRow,
} from "../../Utils/Table/Table";
import { Text } from "../../Utils/Text/Text";
import { getAllUsers, userStatus } from "./getUsers";

const UserView = (): JSX.Element => {
	const [users, setUsers] = useState<User[]>([]);

	useEffect(() => {
		async function getUsers(): Promise<void> {
			const allUsers: User[] = await getAllUsers();
			setUsers(allUsers);
		}
		getUsers();
	}, [users]);

	useEffect(() => {
		socket.on("userUpdate", (data: userStatus) => {
			const found = users.find((user) => user.id == data.id);
			if (found) {
				found.status = data.status;
			}
		});

		return () => {
			socket.off("userUpdate");
		};
	}, []);

	function getListUsers(): JSX.Element[] {
		const rows = [];
		for (let i = 0; i < users.length; i++) {
			const user = users[i];
			rows.push(
				<TableRow key={i}>
					<TableCell>
						<Text fontSize="10">{user.userName}</Text>
					</TableCell>
					<TableCell>
						<Text fontSize="10">{user.wins}</Text>
					</TableCell>
					<TableCell>
						<Text fontSize="10">{user.losses}</Text>
					</TableCell>
					<TableCell>
						<Text
							fontSize="10"
							color={user.status === "Online" ? "#04aa6d" : "#ff3a3a"}
						>
							{user.status}
						</Text>
					</TableCell>
				</TableRow>,
			);
		}
		return rows;
	}

	return (
		<div>
			<Text>Users</Text>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHeaderCell>username</TableHeaderCell>
						<TableHeaderCell>wins</TableHeaderCell>
						<TableHeaderCell>losses</TableHeaderCell>
						<TableHeaderCell>Status</TableHeaderCell>
					</TableRow>
				</TableHeader>
				<TableBody>{users && users.length ? getListUsers() : null}</TableBody>
			</Table>
		</div>
	);
};

export default UserView;
