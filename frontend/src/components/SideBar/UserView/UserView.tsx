import React, { useState, useEffect } from "react";
import { User } from "../../../Types/Types";
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
import { fetchData } from "../../../API/API";
import {
	SharedUserStatuses,
	FindStatus,
	StatusColors,
} from "../../../App/UserStatuses";

const UserView = (): JSX.Element => {
	const [users, setUsers] = useState<User[]>([]);
	const { userStatuses, setUserStatuses } = SharedUserStatuses();

	useEffect(() => {
		async function getUsers(): Promise<void> {
			const allUsers: User[] = await fetchData("/user/all");
			setUsers(allUsers);
		}
		getUsers();
	}, [userStatuses]);

	function getListUsers(): JSX.Element[] {
		const rows = [];
		for (let i = 0; i < users.length; i++) {
			const user = users[i];
			const status = FindStatus(user.id, userStatuses);
			rows.push(
				<TableRow key={i}>
					<TableCell>
						<Link to={`/profile/${user.id}`}>
							<Text hoverColor="#3f3fff">{user.userName}</Text>
						</Link>
					</TableCell>
					<TableCell>
						<Text fontSize="10">{user.wins}</Text>
					</TableCell>
					<TableCell>
						<Text fontSize="10">{user.losses}</Text>
					</TableCell>
					<TableCell>
						<Text fontSize="10" color={StatusColors.get(status)}>
							{status}
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
