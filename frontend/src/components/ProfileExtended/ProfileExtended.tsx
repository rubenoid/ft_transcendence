import React, { useEffect, useState } from "react";
import {
	TextInput,
	Text,
	WidgetContainer,
	Button,
	TableRow,
	TableCell,
	TableHeader,
	TableHeaderCell,
	Table,
	TextContainer,
} from "../Utils/Utils";
import { RoundButton, Item } from "../Utils/Utils";
import { fetchData, postData, User, Match } from "../../API/API";
import {
	SettingsContainer,
	UsersContainer,
} from "../settings/SettingsElements";
import { Label } from "../ConnectionForm/ConnectionFormElements";
import { Img, ImgContainer, TopContainer } from "../Profile/ProfileElements";
import { Link, useNavigate, useParams } from "react-router-dom";

interface detailedUser extends User {
	matches: Match[];
}

const ProfileExtended = (): JSX.Element => {
	const navigator = useNavigate();
	const [user, setUser] = useState<detailedUser>(undefined);
	const { profileId } = useParams();

	useEffect(() => {
		async function getUser(): Promise<User> {
			const user: detailedUser = await fetchData(`/user/get/${profileId}`);
			user.friends = await fetchData(`/friends/get/${profileId}`);
			user.matches = await fetchData(`/match/getUserHistory/${profileId}`);
			setUser(user);
			return user;
		}
		getUser();
	}, [profileId]);

	const settingsData = () => {
		const listfriends = user.friends.map((value: User, key: number) => {
			return (
				<Link key={key} to={`/profile/${value.id}`}>
					<Text>{value.userName}</Text>
				</Link>
			);
		});

		const listmatches = user.matches.map((value: Match, key: number) => {
			return (
				<TableRow key={key}>
					{value.players[0].userName == user.userName && value.players[1] ? (
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
						{value.players[0].userName == user.userName ? (
							<Text fontSize="10">{value.scorePlayer1}</Text>
						) : (
							<Text fontSize="10">{value.scorePlayer2}</Text>
						)}
					</TableCell>
					<TableCell>
						{value.players[0].userName == user.userName ? (
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
				<Item>
					<h1>{user.userName}s Profile</h1>
				</Item>
				<ImgContainer>
					<Img
						src={"http://localhost:5000/" + user.avatar}
						alt="profileImg"
						width="300"
						height="300"
					/>
				</ImgContainer>
				<TopContainer>
					<Label>
						{" "}
						<Text fontSize="20px">Username</Text>
					</Label>
					<Text fontSize="20px">{user.userName}</Text>
				</TopContainer>
				<TopContainer>
					<Label>
						{" "}
						<Text fontSize="20px">FirstName</Text>
					</Label>
					<Text fontSize="20px">{user.firstName}</Text>
				</TopContainer>
				<TopContainer>
					<Label>
						{" "}
						<Text fontSize="20px">LastName</Text>
					</Label>
					<Text fontSize="20px">{user.lastName}</Text>
				</TopContainer>
				<TopContainer>
					<Label>
						{" "}
						<Text fontSize="20px">losses</Text>
					</Label>
					<Text fontSize="20px">{user.losses}</Text>
				</TopContainer>
				<TopContainer>
					<Label>
						{" "}
						<Text fontSize="20px">wins</Text>
					</Label>
					<Text fontSize="20px">{user.wins}</Text>
				</TopContainer>
				<TopContainer>
					<Label>
						{" "}
						<Text fontSize="20px">rating</Text>
					</Label>
					<Text fontSize="20px">{user.rating}</Text>
				</TopContainer>
				<Item>
					<Label>
						{" "}
						<Text fontSize="20px">Friends</Text>
					</Label>
					<Table>
						{user.friends.length ? (
							<TableHeader>
								<TableRow>
									<TableHeaderCell>Username</TableHeaderCell>
									<TableHeaderCell>First Name</TableHeaderCell>
									<TableHeaderCell>Last Name</TableHeaderCell>
								</TableRow>
							</TableHeader>
						) : (
							""
						)}
						<tbody>
							{user.friends.length ? listfriends : <Item>No friends</Item>}
						</tbody>
					</Table>
				</Item>
				<Label>
					{" "}
					<Text fontSize="20px">Macthes</Text>
				</Label>
				<Table>
					{user.matches.length ? (
						<TableHeader>
							<TableRow>
								<TableHeaderCell>Played Against</TableHeaderCell>
								<TableHeaderCell>score P1</TableHeaderCell>
								<TableHeaderCell>score P2</TableHeaderCell>
							</TableRow>
						</TableHeader>
					) : (
						""
					)}
					<tbody>
						{user.matches.length ? listmatches : <Item>No matches</Item>}
					</tbody>
				</Table>
			</>
		);
	};
	return (
		<SettingsContainer>{user ? settingsData() : "loading"}</SettingsContainer>
	);
};

export default ProfileExtended;
