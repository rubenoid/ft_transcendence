import React, { useEffect, useState } from "react";
import { fetchData } from "../../API/API";
import { User, Match } from "../../Types/Types";
import { SettingsContainer } from "../Settings/SettingsElements";
import {
	Img,
	ImgContainer,
	TopContainer,
	FriendsWrapper,
	ProfileWrapper,
	ProfileHeader,
	Padding,
	DetailsWrapper,
} from "../Profile/ProfileElements";
import { Link, useParams } from "react-router-dom";
import { Item } from "../Utils/List/List";
import { Header, HeaderTwo, Text } from "../Utils/Text/Text";
import ListMatch from "./ListMatch";
import { LinkButton } from "../Utils/Buttons/Button/LinkButton";

interface detailedUser extends User {
	matches: Match[];
	status: string;
}

interface userStatus {
	id: number;
	status: string;
}

const ProfileExtended = (): JSX.Element => {
	const [user, setUser] = useState<detailedUser>(undefined);
	const [isBlocked, setIsBlocked] = useState<number>(0);
	const { profileId } = useParams();

	useEffect(() => {
		async function getUser(): Promise<detailedUser> {
			const user: detailedUser | string = await fetchData(
				`/user/get/${profileId}`,
			);
			console.log("USERTYPE", typeof user);
			if (typeof user != "object") {
				if (typeof user == "number") setIsBlocked(2);
				else setIsBlocked(1);
				return;
			}
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
			<ProfileWrapper>
				<ProfileHeader>
					<ImgContainer>
						<Img
							src={"http://localhost:5000/" + user.avatar}
							alt="profileImg"
							width="300"
							height="300"
						/>
					</ImgContainer>
					<div>
						<Header>{user.userName}s Profile</Header>
						<Padding>
							<Text fontSize="20px">{user.status}</Text>
						</Padding>
					</div>
				</ProfileHeader>

				<DetailsWrapper>
					<TopContainer>
						<Text fontSize="20px">Username</Text>
						<Text fontSize="20px">{user.userName}</Text>
					</TopContainer>
					<TopContainer>
						<Text fontSize="20px">FirstName</Text>
						<Text fontSize="20px">{user.firstName}</Text>
					</TopContainer>
					<TopContainer>
						<Text fontSize="20px">LastName</Text>
						<Text fontSize="20px">{user.lastName}</Text>
					</TopContainer>
					<TopContainer>
						<Text fontSize="20px">losses</Text>
						<Text fontSize="20px">{user.losses}</Text>
					</TopContainer>
					<TopContainer>
						<Text fontSize="20px">wins</Text>
						<Text fontSize="20px">{user.wins}</Text>
					</TopContainer>
					<TopContainer>
						<Text fontSize="20px">rating</Text>
						<Text fontSize="20px">{user.rating}</Text>
					</TopContainer>
				</DetailsWrapper>
				<HeaderTwo>Friends</HeaderTwo>
				<TopContainer>
					{user.friends.length ? listfriends : <Text>No friends</Text>}
				</TopContainer>
				<HeaderTwo>Matches</HeaderTwo>
				<TopContainer>
					<ListMatch user={user}></ListMatch>
				</TopContainer>
			</ProfileWrapper>
		);
	};
	return (
		<SettingsContainer>
			{isBlocked != 0
				? isBlocked == 1
					? "User is unavailable!"
					: "You blocked this user! Go to settings to unblock"
				: user
				? friendsData()
				: "loading"}
			<LinkButton to={-1}>
				<Text>Back</Text>
			</LinkButton>
		</SettingsContainer>
	);
};

export default ProfileExtended;
