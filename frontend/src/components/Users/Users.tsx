import React, { useState, useEffect } from "react";
import { fetchData } from "../../API/API";
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
import { User } from "../../Types/Types";

interface detailedUser extends User {
	status: string;
}

interface userStatus {
	id: number;
	status: string;
}

let users: detailedUser[] = [];

const Users = (): JSX.Element => {
	const [userlist, setuserlist] = useState(undefined);

	useEffect(() => {
		async function getUsers(): Promise<void> {
			const foundUsers: detailedUser[] = await fetchData("/user/all");
			const allStatus: userStatus[] = await fetchData("/user/getAllStatus");
			for (let i = 0; i < allStatus.length; i++) {
				const e = allStatus[i];
				const found = foundUsers.find((x) => x.id == e.id);
				if (found) {
					found.status = e.status;
				}
			}
			users = foundUsers;
			setListUsers();
		}
		getUsers();
	}, [fetchData]);

	useEffect(() => {
		socket.on("userUpdate", (data: userStatus) => {
			const found = users.find((x) => x.id == data.id);
			if (found) {
				found.status = data.status;
				setListUsers();
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
						<Text fontSize="10">{e.id}</Text>
					</TableCell>
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
		setuserlist(data);
		return data;
	}

	return (
		<WidgetContainer>
			<Text>Users</Text>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHeaderCell>id</TableHeaderCell>
						<TableHeaderCell>username</TableHeaderCell>
						<TableHeaderCell>wins</TableHeaderCell>
						<TableHeaderCell>losses</TableHeaderCell>
						<TableHeaderCell>Status</TableHeaderCell>
					</TableRow>
				</TableHeader>
				<TableBody>{userlist ? userlist : null}</TableBody>
			</Table>
		</WidgetContainer>
	);
};

export default Users;
