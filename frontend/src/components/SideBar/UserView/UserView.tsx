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
import { Link } from "react-router-dom";

interface userStatus {
	id: number;
	status: string;
}

const UserView = (): JSX.Element => {
	const [users, setUsers] = useState<User[]>([]);
	const [usersStatus, setUsersStatus] = useState<userStatus[]>([]);

	useEffect(() => {
		async function getUsers(): Promise<void> {
			const allUsers: User[] = await fetchData("/user/all");
			const allStatus: userStatus[] = await fetchData("/user/getAllStatus");
			setUsers(allUsers);
			setUsersStatus(allStatus);
		}
		getUsers();
	}, [users]);

	function setUserStatus(user: User): void {
		const found = usersStatus.find((currentUser) => currentUser.id == user.id);
		if (found) {
			user.status = found.status;
		}
	}

	useEffect(() => {
		socket.on("userUpdate", (data: userStatus) => {
			const found = users.find((user) => user.id == data.id);
			if (found) {
				found.status = data.status;
				getListUsers();
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
			setUserStatus(user);
			rows.push(
				<TableRow key={i}>
					<TableCell>
						<Link to={`/profile/${user.id}`}>
							<Text>{user.userName}</Text>
						</Link>
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
							{user.status ? user.status : "Offline"}
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
