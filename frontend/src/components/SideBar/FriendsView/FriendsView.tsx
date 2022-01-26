import React, { useEffect, useState } from "react";
import { Text } from "../../Utils/Text/Text";
import { fetchData, postData } from "../../../API/API";
import { Item } from "../../Utils/List/List";
import { Channel, User } from "../../../Types/Types";
import { SharedChatState } from "../SideBar";
import {
	FriendsViewContainer,
	FriendsCardContainer,
	FriendsTitleContainer,
	FriendsCardButton,
	FriendsButtonContainer,
	FriendsImageContainer,
	FriendsNameContainer,
} from "./FriendsViewElements";
import { Img } from "../../Profile/ProfileElements";
import { useNavigate, Link } from "react-router-dom";
import FindFriends from "./FindFriends";
import AddFriend from "../../AddFriend/AddFriend";

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

	async function getFriends(): Promise<User[]> {
		const friends: User[] = await fetchData("/friends/me");
		console.log("USERS->hi", friends);
		setFriends(friends);
		return friends;
	}
	
	useEffect(() => {

		getFriends();
	}, []);

	function goToProfile(id: number): void {
		navigate(`/profile/${id}`, { replace: true });
	}

	async function addFriend(user: User): Promise<void> {
		await fetchData(`/friends/add/${user.id}`);
		getFriends();
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
		<FriendsViewContainer>
			<Item>
				<Text>Friends:</Text>
				<FindFriends onEnter={(e) => addFriend(e)}></FindFriends>
			</Item>
			{friends.length ? listFriends : <Item>No Friends Yet, Add one !</Item>}
		</FriendsViewContainer>
	);
};

export default FriendsView;
