import React, { useEffect, useState } from "react";
import { fetchData } from "../../API/API";
import { User, Match } from "../../Types/Types";
import { SettingsContainer } from "../Settings/SettingsElements";
import { Label } from "../ConnectionForm/ConnectionFormElements";
import {
	Img,
	ImgContainer,
	TopContainer,
	FriendsWrapper,
} from "../Profile/ProfileElements";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Item } from "../Utils/List/List";
import { Text } from "../Utils/Text/Text";
import ListMatch from "./ListMatch/ListMatch";
import { detailedUser } from "../../Types/Types";

interface userStatus {
	id: number;
	status: string;
}

const ProfileExtended = (): JSX.Element => {
	const [user, setUser] = useState<detailedUser>(undefined);
	const { profileId } = useParams();

	useEffect(() => {
		async function getUser(): Promise<detailedUser> {
			const user: detailedUser = await fetchData(`/user/get/${profileId}`);

			user.friends = [];
			user.matches = [];
			user.status = "";
			fetchData(`/friends/get/${profileId}`)
				.then((friends: User[]) => {
					user.friends = friends;
					setUser({ ...user });
				})
				.catch((er) => {
					console.log("1", er);
				});
			fetchData(`/match/getUserHistory/${profileId}`)
				.then((match: Match[]) => {
					user.matches = match;
					setUser({ ...user });
				})
				.catch((er) => {
					console.log("2", er);
				});

			fetchData(`/user/userStatus/${profileId}`)
				.then((status: string) => {
					user.status = status;
					setUser({ ...user });
				})
				.catch((er) => {
					console.log("3", er);
				});
			return user;
		}
		getUser();
	}, [profileId]);

	const friendsData = (): JSX.Element => {
		const listfriends = user.friends.map((value: User, key: number) => {
			return (
				<Link to={`/profile/${value.id}`} key={key}>
					<Text>{value.userName}</Text>
				</Link>
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
						<Text fontSize="20px">Username</Text>
					</Label>
					<Text fontSize="20px">{user.userName}</Text>
				</TopContainer>
				<TopContainer>
					<Label>
						<Text fontSize="20px">FirstName</Text>
					</Label>
					<Text fontSize="20px">{user.firstName}</Text>
				</TopContainer>
				<TopContainer>
					<Label>
						<Text fontSize="20px">LastName</Text>
					</Label>
					<Text fontSize="20px">{user.lastName}</Text>
				</TopContainer>
				<TopContainer>
					<Label>
						<Text fontSize="20px">status</Text>
					</Label>
					<Text fontSize="20px">{user.status}</Text>
				</TopContainer>
				<TopContainer>
					<Label>
						<Text fontSize="20px">losses</Text>
					</Label>
					<Text fontSize="20px">{user.losses}</Text>
				</TopContainer>
				<TopContainer>
					<Label>
						<Text fontSize="20px">wins</Text>
					</Label>
					<Text fontSize="20px">{user.wins}</Text>
				</TopContainer>
				<TopContainer>
					<Label>
						<Text fontSize="20px">rating</Text>
					</Label>
					<Text fontSize="20px">{user.rating}</Text>
				</TopContainer>
				<Item>
					<Label>
						<Text fontSize="20px">Friends</Text>
					</Label>
					<FriendsWrapper>
						{user.friends.length ? listfriends : <Text>No friends</Text>}
					</FriendsWrapper>
				</Item>
				<Label>
					<Text fontSize="20px">Matches</Text>
				</Label>
				<ListMatch/>
			</>
		);
	};
	return (
		<SettingsContainer>{user ? friendsData() : "loading"}</SettingsContainer>
	);
};

export default ProfileExtended;
