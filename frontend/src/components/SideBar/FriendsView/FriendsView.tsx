import React, { useEffect, useState } from "react";
import { Text } from "../../Utils/Text/Text";
import { fetchData, postData } from "../../../API/API";
import { List, Item } from "../../Utils/List/List";
import { Button } from "../../Utils/Buttons/Button/Button";
import { Channel, User } from "../../../Types/Types";

type ChatSideBarProps = {
	setSelectedUser: React.Dispatch<React.SetStateAction<Channel>>;
};

// const FriendsView = (): JSX.Element => {
const FriendsView = (props: ChatSideBarProps): JSX.Element => {
	const [friends, setFriends] = useState<User[]>([]);
	
	async function createNewChat(id: number): Promise<void> {
		console.log("createNewChattt");
		const chatId: number = await postData("chat/createNewChat", { ids: [id] });
		console.log(chatId);

		const chatData: Channel = await fetchData(`chat/get/${chatId}`);
		console.log("cheatData: ", chatData);
		props.setSelectedUser(chatData);
	}

	useEffect(() => {
		async function getFriends(): Promise<User[]> {
			const friends: User[] = await fetchData("/friends/me");
			console.log("USERS->hi", friends);
			setFriends(friends);
			return friends;
		}
		getFriends();
	}, [fetchData]);

	const listFriends = friends.map((user: User, key: number) => {
		return (
			<Item key={user.id}>
				<Button
					onClick={() => {
						createNewChat(user.id);
					}}
				>
					{user.userName}
				</Button>
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
