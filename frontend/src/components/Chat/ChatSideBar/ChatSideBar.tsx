import React, { useEffect, useState } from "react";
import { SideBar } from "./ChatSideBarElements";
import { List, Button, Item } from "../../Utils/Utils";
import { User, fetchData, postData } from "../../../API/API";
import { Channel } from "../Chat";

type ChatSideBarProps = {
	setSelectedUser: React.Dispatch<React.SetStateAction<Channel>>;
};

const ChatSideBar = (props: ChatSideBarProps): JSX.Element => {
	const [friends, setFriends] = useState<User[]>([]);
	const [channels, setChannels] = useState<Channel[]>([]);

	async function createNewChat(id: number) {
		const chatId = await postData("chat/createNewChat", { ids: [id] });
		console.log(chatId);

		// props.setSelectedUser(undefined);
	}

	async function openChat(channel: Channel) {
		props.setSelectedUser(channel);
	}

	useEffect(() => {
		async function getFriends(): Promise<User[]> {
			const friends: User[] = await fetchData("/friends/me");
			console.log("USERS->", friends);
			setFriends(friends);
			return friends;
		}
		getFriends();
	}, []);

	useEffect(() => {
		async function getChannels(): Promise<Channel[]> {
			const channels: Channel[] = await fetchData("/user/me/chats");
			console.log("USERS->", channels);
			setChannels(channels);
			return channels;
		}
		getChannels();
	}, []);

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

	const listChannels = channels.map((channel: Channel, key: number) => {
		return (
			<Item key={channel.id}>
				<Button
					onClick={() => {
						openChat(channel);
					}}
				>
					{channel.name}
				</Button>
			</Item>
		);
	});

	return (
		<SideBar>
			<List>
				<h1>Friends</h1>
				{friends.length ? listFriends : <h2>No Friends Yet, Add one !</h2>}
			</List>
			<List>
				<h1>Channels</h1>
				{channels.length ? listChannels : <h2>No Channels Yet, Add one !</h2>}
			</List>
		</SideBar>
	);
};

export default ChatSideBar;
