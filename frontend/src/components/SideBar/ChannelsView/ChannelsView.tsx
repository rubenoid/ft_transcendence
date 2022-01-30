import React, { useState, useEffect } from "react";
import { Text } from "../../Utils/Text/Text";
import { fetchData, postData } from "../../../API/API";
import { List, Item } from "../../Utils/List/List";
import { Button } from "../../Utils/Buttons/Button/Button";
import { Channel, User } from "../../../Types/Types";
import { SharedChatState, outputChatName } from "../SideBar";
import {
	ChannelTitleContainer,
	ChannelCreateContainer,
	ChannelCard,
	RadioInput,
} from "./ChannelsViewElements";
import { TextInput } from "../../Utils/TextInput/TextInput";
import { SharedUserState } from "../../../App/UserStatus";
import AddUserInput from "../../AddUserInput/AddUserInput";
import CreateGroupForm from "./ChannelCreate";

const ChannelsView = (): JSX.Element => {
	const [channels, setChannels] = useState<Channel[]>([]);
	const [showForm, setShowForm] = useState<boolean>(false);
	const { channel, setChannel } = SharedChatState();
	const { user, setUser } = SharedUserState();

	async function getChannels(): Promise<Channel[]> {
		let channels: Channel[] = await fetchData("/chat/public");

		const tmp: Channel[] = await fetchData("/user/me/chats");

		channels.push(...tmp);

		channels = channels.filter((value, i, arr) => {
			return arr.findIndex((x) => x.id == value.id) === i;
		});

		setChannels(channels);
		return channels;
	}

	useEffect(() => {
		getChannels();
	}, []);

	async function openChat(id: number): Promise<void> {
		const channelData: Channel = await fetchData(`/chat/get/${id}`);

		setChannel(channelData);
	}

	const listChannels = channels.map((channel: Channel, key: number) => {
		return (
			<Item key={channel.id}>
				<ChannelCard
					onClick={() => {
						openChat(channel.id);
					}}
				>
					<Text fontSize="20px">
						{channel.isPublic
							? channel.name
							: outputChatName(channel, user, channel.name)}
					</Text>
					<Text>{channel.isProtected ? "🔑" : ""}</Text>
				</ChannelCard>
			</Item>
		);
	});

	const handleChangeSearch = (e: string): void => {
		async function getUser4Change(): Promise<User> {
			const endpoint = `/user/getByUserName/${e}`;
			const user: User = await fetchData(endpoint);
			if (user) {
			}
			return user;
		}
		getUser4Change();
	};

	return (
		<div>
			<List>
				<ChannelTitleContainer>
					<div>
						<Text>Channels</Text>
						<Text>Create a new group</Text>
					</div>
					<Button
						onClick={() => {
							setShowForm(true);
						}}
					>
						+
					</Button>
				</ChannelTitleContainer>
				{showForm ? (
					<CreateGroupForm
						onSuccess={(chan) => {
							setChannel(chan);
							setShowForm(false);
							getChannels();
						}}
						onFail={() => setShowForm(false)}
					/>
				) : (
					""
				)}
				{channels.length ? listChannels : <h2>No Channels Yet, Add one !</h2>}
			</List>
		</div>
	);
};

export default ChannelsView;
