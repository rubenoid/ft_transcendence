import React, { useState, useEffect } from "react";
import { fetchData } from "../../../API/API";
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

interface userStatus {
	id: number;
	status: string;
}

const UserView = (): JSX.Element => {
	const [users, setUsers] = useState<User[]>([]);

	useEffect(() => {
		async function getUsers(): Promise<void> {
			const allUsers: User[] = await fetchData("/user/all");
			const allStatus: userStatus[] = await fetchData("/user/getAllStatus");
			for (let i = 0; i < allStatus.length; i++) {
				const e = allStatus[i];
				const foundUser = allUsers.find((x) => x.id == e.id);
				if (foundUser) {
					foundUser.status = e.status;
				}
			}
			setUsers(allUsers);
		}
		getUsers();
	}, []);

	useEffect(() => {
		socket.on("userUpdate", (data: userStatus) => {
			if (!users) return;
			const found = users.find((x) => x.id == data.id);
			if (found) {
				found.status = data.status;
			}
		});
	}, []);

	function setListUsers(): JSX.Element[] {
		const data = [];
		for (let i = 0; i < users.length; i++) {
			const e = users[i];
			data.push(
				<TableRow key={i}>
					<TableCell>
						<Text fontSize="10">{e.userName}</Text>
					</TableCell>
					<TableCell>
						<Text fontSize="10">{e.wins}</Text>
					</TableCell>
					<TableCell>
						<Text fontSize="10">{e.losses}</Text>
					</TableCell>
					<TableCell>
						<Text fontSize="10">{e.status ? e.status : "Offline"}</Text>
					</TableCell>
				</TableRow>,
			);
		}
		return data;
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
				<TableBody>{users && users.length ? setListUsers() : null}</TableBody>
			</Table>
		</div>
	);
};

export default UserView;
