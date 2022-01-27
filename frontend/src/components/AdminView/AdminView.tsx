import React, { useEffect, useState } from "react";
import { Label } from "../ConnectionForm/ConnectionFormElements";
import { AdminContainer } from "./AdminViewElements";
import {
	TableRow,
	AdminTableCell,
	TableHeader,
	AdminTableHeader,
	AdminTable,
} from "../Utils/Table/Table";
import { Text } from "../Utils/Text/Text";
import { Match, Channel, User } from "../../Types/Types";
import { fetchData } from "../../API/API";
import { Img, ImgContainer } from "../Profile/ProfileElements";

export interface detailedUser extends User {
	twoFactorSecret: string;
	blockedUsers: User[];
	blockedBy: User[];
	initial2FAEnabled: boolean;
}

const AdminView = (): JSX.Element => {
	const [users, setUsers] = useState<detailedUser[]>([]);
	const [matches, setMatches] = useState<Match[]>([]);
	const [channels, setChannels] = useState<Channel[]>([]);

	useEffect(() => {
		async function getData(): Promise<void> {
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
		}
		getData();
	}, []);

	const channellist = channels.map((channels: Channel, key: number) => {
		return (
			<TableRow key={key}>
				<AdminTableCell>
					<Text fontSize="10" color="black">
						{channels.id}
					</Text>
				</AdminTableCell>
				<AdminTableCell>
					<Text fontSize="10" color="black">
						{channels.name}
					</Text>
				</AdminTableCell>
				<AdminTableCell>
					{channels.isProtected ? <Text>Protected</Text> : ""}
					{channels.isPublic && !channels.isProtected ? (
						<Text color="black">public</Text>
					) : (
						""
					)}
					{!channels.isPublic ? (
						<Text fontSize="10" color="black">
							private
						</Text>
					) : (
						""
					)}
				</AdminTableCell>
				<AdminTableCell>
					{!channels.isPublic ? (
						<Text fontSize="10" color="black">
							Na
						</Text>
					) : (
						<Text fontSize="10" color="black">
							{channels.owner}
						</Text>
					)}
				</AdminTableCell>
				<AdminTableCell>
					{!channels.isPublic ? (
						<Text fontSize="10" color="black">
							Na
						</Text>
					) : (
						<>
							{channels.admins.map((user: User, key: number) => {
								return <p key={key}>{user.userName}</p>;
							})}
						</>
					)}
				</AdminTableCell>
			</TableRow>
		);
	});

	const matchlist = matches.map((matches: Match, key: number) => {
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

	const userlist = users.map((users: detailedUser, key: number) => {
		return (
			<TableRow key={key}>
				<AdminTableCell>
					<Text fontSize="10" color="black">
						{users.id}
					</Text>
				</AdminTableCell>
				<AdminTableCell>
					<Text fontSize="10" color="black">
						{users.userName}
					</Text>
				</AdminTableCell>
				<AdminTableCell>
					<Text fontSize="10" color="black">
						{users.firstName}
					</Text>
				</AdminTableCell>
				<AdminTableCell>
					<Text fontSize="10" color="black">
						{users.lastName}
					</Text>
				</AdminTableCell>
				<AdminTableCell>
					<ImgContainer>
						<Img
							src={"http://localhost:5000/" + users.avatar}
							alt="profileImg"
							width="300"
							height="300"
						/>
					</ImgContainer>
				</AdminTableCell>
				<AdminTableCell>
					<Text fontSize="10" color="black">
						{users.wins}
					</Text>
				</AdminTableCell>
				<AdminTableCell>
					<Text fontSize="10" color="black">
						{users.losses}
					</Text>
				</AdminTableCell>
				<AdminTableCell>
					<Text fontSize="10" color="black">
						{users.rating}
					</Text>
				</AdminTableCell>
				<AdminTableCell>
					{users.twoFactorSecret == "" ? (
						<Text fontSize="10" color="black">
							No
						</Text>
					) : (
						<Text fontSize="10" color="black">
							Yes
						</Text>
					)}
				</AdminTableCell>
				<AdminTableCell>
					{users.friends.map((user: User, key: number) => {
						return <p key={key}>{user.userName}</p>;
					})}
				</AdminTableCell>
				<AdminTableCell>
					{users.blockedUsers.map((user: User, key: number) => {
						return <p key={key}>{user.userName}</p>;
					})}
				</AdminTableCell>
			</TableRow>
		);
	});

	return (
		<AdminContainer>
			<h1>Admin View</h1>
			<Label>
				<Text fontSize="20px" color="black">
					Users
				</Text>
			</Label>
			<AdminTable>
				<TableHeader>
					<TableRow>
						<AdminTableHeader>id</AdminTableHeader>
						<AdminTableHeader>Username</AdminTableHeader>
						<AdminTableHeader>First Name</AdminTableHeader>
						<AdminTableHeader>Last Name</AdminTableHeader>
						<AdminTableHeader>avatar</AdminTableHeader>
						<AdminTableHeader>wins</AdminTableHeader>
						<AdminTableHeader>losses</AdminTableHeader>
						<AdminTableHeader>rating</AdminTableHeader>
						<AdminTableHeader>2FA Enabled</AdminTableHeader>
						<AdminTableHeader>friends</AdminTableHeader>
						<AdminTableHeader>blockedUsers</AdminTableHeader>
					</TableRow>
				</TableHeader>
				<tbody>{users ? userlist : null}</tbody>
			</AdminTable>
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
				<tbody>{matches ? matchlist : null}</tbody>
			</AdminTable>

			<Label>
				<Text fontSize="20px" color="black">
					Channels and chats
				</Text>
			</Label>
			<AdminTable>
				<TableHeader>
					<TableRow>
						<AdminTableHeader>id</AdminTableHeader>
						<AdminTableHeader>name</AdminTableHeader>
						<AdminTableHeader>privacy level</AdminTableHeader>
						<AdminTableHeader>owner</AdminTableHeader>
						<AdminTableHeader>admins</AdminTableHeader>
					</TableRow>
				</TableHeader>
				<tbody>{channels ? channellist : null}</tbody>
			</AdminTable>
		</AdminContainer>
	);
};
export default AdminView;
