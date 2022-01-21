import React, { useEffect, useState } from "react";
import { Text } from "../../Utils/Text/Text";
import { fetchData, postData } from "../../../API/API";
import { List, Item } from "../../Utils/List/List";
import { Button } from "../../Utils/Buttons/Button/Button";
import { Channel, User } from "../../../Types/Types";
import { SharedChatState } from "../SideBar";
import {
	FriendsCardContainer,
	FriendsTitleContainer,
	FriendsCardButton,
	FriendsButtonContainer,
	FriendsImageContainer,
	FriendsNameContainer,
} from "./FriendsViewElements";
import { Img } from "../../Profile/ProfileElements";
import { useNavigate, Link } from "react-router-dom";

const FriendsView = (): JSX.Element => {
	const navigate = useNavigate();
	const [friends, setFriends] = useState<User[]>([]);
	const { channel, setChannel } = SharedChatState();

	async function createNewChat(id: number): Promise<void> {
		console.log("createNewChattt");
		const chatId: number = await postData("chat/createNewChat", { ids: [id] });
		console.log(chatId);

		const chatData: Channel = await fetchData(`chat/get/${chatId}`);
		console.log("cheatData: ", chatData);
		setChannel(chatData);
	}

	useEffect(() => {
		async function getFriends(): Promise<User[]> {
			const friends: User[] = await fetchData("/friends/me");
			console.log("USERS->hi", friends);
			setFriends(friends);
			return friends;
		}
		getFriends();
	}, []);

	function goToProfile(id: number): void {
		navigate(`/profile/${id}`, { replace: true });
	}

	const listFriends = friends.map((user: User, key: number) => {
		return (
			<Item key={user.id}>
				<FriendsCardContainer>
					<FriendsTitleContainer>
						<FriendsImageContainer>
							<Img src={"http://localhost:5000/" + user.avatar} />
						</FriendsImageContainer>
						<FriendsNameContainer>
							<Text color="black">{user.userName}</Text>
							<Text color="black">{"Online"}</Text>
						</FriendsNameContainer>
					</FriendsTitleContainer>
					<FriendsButtonContainer>
						<div>
							<FriendsCardButton
								onClick={() => {
									goToProfile(user.id);
								}}
							>
								👤
							</FriendsCardButton>
						</div>
						<div>
							<FriendsCardButton
								onClick={() => {
									createNewChat(user.id);
								}}
							>
								✉
							</FriendsCardButton>
						</div>
					</FriendsButtonContainer>
				</FriendsCardContainer>
			</Item>
		);
	});

	return (
		<div>
			<List>
				<Item>
					<Text>Friends:</Text>
				</Item>
				{friends.length ? listFriends : <Item>No Friends Yet, Add one !</Item>}
			</List>
		</div>
	);
};

export default FriendsView;
