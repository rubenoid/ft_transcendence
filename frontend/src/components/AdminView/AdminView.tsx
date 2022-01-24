import React, { useEffect, useState } from "react";
import { Label } from "../ConnectionForm/ConnectionFormElements";
import {
	SettingsContainer,
	UsersContainer,
} from "../Settings/SettingsElements";
import {
	TableRow,
	TableCell,
	TableHeader,
	TableHeaderCell,
	Table,
} from "../Utils/Table/Table";
import { Text } from "../Utils/Text/Text";
import { detailedUser, Match, Channel } from "../../Types/Types";
import { fetchData } from "../../API/API";
import { Img, ImgContainer } from "../Profile/ProfileElements";

const AdminView = (): JSX.Element => {
	const [users, setUsers] = useState<detailedUser[]>([]);
	const [matches, setMatches] = useState<Match[]>([]);
	const [channels, setChannels] = useState<Channel[]>([]);

	useEffect(() => {
		async function getUsers(): Promise<detailedUser[]> {
			console.log("gettin all users n relations");
			const users: detailedUser[] = await fetchData(
				"/user/getAllUsersNRelations",
			);
			const matches: Match[] = await fetchData("/match/getAllMatches");
			const channels: Channel[] = await fetchData("/chat/all");
			setUsers(users);
			setMatches(matches);
			setChannels(channels);
			console.log(channels);
			return users;
		}
		getUsers();
	}, []);

	const channellist = channels.map((channels: Channel, key: number) => {
		return (
			<TableRow key={key}>
				<TableCell>
					<Text fontSize="10">{channels.id}</Text>
				</TableCell>
				<TableCell>
					<Text fontSize="10">{channels.name}</Text>
				</TableCell>
				<TableCell>
					{channels.isProtected ? <Text>Protected</Text> : ""}
					{channels.isPublic && !channels.isProtected ? (
						<Text>public</Text>
					) : (
						""
					)}
					{!channels.isPublic ? <Text>private</Text> : ""}
				</TableCell>
				<TableCell>
					{!channels.isPublic ? <Text>Na</Text> : <Text>{channels.owner}</Text>}
				</TableCell>
				{/* <TableCell>
					{!channels.isPublic ? <Text>Na</Text> : 
					<Text>{channels.admin[0].username}</Text>}
				</TableCell> */}
			</TableRow>
		);
	});

	const matchlist = matches.map((matches: Match, key: number) => {
		return (
			<TableRow key={key}>
				<TableCell>
					<Text fontSize="10">{matches.id}</Text>
				</TableCell>
				<TableCell>
					<Text fontSize="10">{matches.players[0].userName}</Text>
				</TableCell>
				<TableCell>
					{matches.players[1] ? (
						<Text fontSize="10">{matches.players[1].userName}</Text>
					) : (
						<Text>NA</Text>
					)}
				</TableCell>
				<TableCell>
					<Text fontSize="10">{matches.scorePlayer1}</Text>
				</TableCell>
				<TableCell>
					<Text fontSize="10">{matches.scorePlayer2}</Text>
				</TableCell>
			</TableRow>
		);
	});

	const userlist = users.map((users: detailedUser, key: number) => {
		return (
			<TableRow key={key}>
				<TableCell>
					<Text fontSize="10">{users.id}</Text>
				</TableCell>
				<TableCell>
					<Text fontSize="10">{users.userName}</Text>
				</TableCell>
				<TableCell>
					<Text fontSize="10">{users.firstName}</Text>
				</TableCell>
				<TableCell>
					<Text fontSize="10">{users.lastName}</Text>
				</TableCell>
				<TableCell>
					<ImgContainer>
						<Img
							src={"http://localhost:5000/" + users.avatar}
							alt="profileImg"
							width="300"
							height="300"
						/>
					</ImgContainer>
				</TableCell>
				<TableCell>
					<Text fontSize="10">{users.wins}</Text>
				</TableCell>
				<TableCell>
					<Text fontSize="10">{users.losses}</Text>
				</TableCell>
				<TableCell>
					<Text fontSize="10">{users.rating}</Text>
				</TableCell>
				<TableCell>
					{users.twoFactorSecret == "" ? <Text>No</Text> : <Text>Yes</Text>}
				</TableCell>
				{/* <TableCell>
					<Text fontSize="10">{userz.friends}</Text>
				</TableCell>
				<TableCell>
					<Text fontSize="10">{userz.blockedUsers}</Text>
				</TableCell> */}
			</TableRow>
		);
	});

	return (
		<SettingsContainer>
			<h1>AdminView</h1>
			<Label>
				<Text fontSize="20px">Users</Text>
			</Label>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHeaderCell>id</TableHeaderCell>
						<TableHeaderCell>Username</TableHeaderCell>
						<TableHeaderCell>First Name</TableHeaderCell>
						<TableHeaderCell>Last Name</TableHeaderCell>
						<TableHeaderCell>avatar</TableHeaderCell>
						<TableHeaderCell>wins</TableHeaderCell>
						<TableHeaderCell>losses</TableHeaderCell>
						<TableHeaderCell>rating</TableHeaderCell>
						<TableHeaderCell>twoFactorSecret</TableHeaderCell>
						<TableHeaderCell>friends</TableHeaderCell>
						<TableHeaderCell>blockedUsers</TableHeaderCell>
					</TableRow>
				</TableHeader>
				<tbody>{users ? userlist : null}</tbody>
			</Table>
			<Label>
				<Text fontSize="20px">Matches</Text>
			</Label>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHeaderCell>id</TableHeaderCell>
						<TableHeaderCell>Player 1</TableHeaderCell>
						<TableHeaderCell>Player 2</TableHeaderCell>
						<TableHeaderCell>Score P1</TableHeaderCell>
						<TableHeaderCell>Score P2</TableHeaderCell>
					</TableRow>
				</TableHeader>
				<tbody>{matches ? matchlist : null}</tbody>
			</Table>

			<Label>
				<Text fontSize="20px">Channels and chats</Text>
			</Label>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHeaderCell>id</TableHeaderCell>
						<TableHeaderCell>name</TableHeaderCell>
						<TableHeaderCell>privacy level</TableHeaderCell>
						<TableHeaderCell>owner</TableHeaderCell>
						<TableHeaderCell>admin</TableHeaderCell>
					</TableRow>
				</TableHeader>
				<tbody>{channels ? channellist : null}</tbody>
			</Table>
		</SettingsContainer>
	);
};
export default AdminView;
