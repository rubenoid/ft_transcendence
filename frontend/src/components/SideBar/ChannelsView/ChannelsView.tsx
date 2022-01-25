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
} from "./ChannelsViewElements";
import { TextInput } from "../../Utils/TextInput/TextInput";
import { SearchResultContainer } from "../../AddFriend/AddFriendElements";
import { Form } from "../../ConnectionForm/ConnectionFormElements";
import { SharedUserState } from "../../../App/UserStatus";
import AddUserInput from "../../AddUserInput/AddUserInput";

class CreateChannelsForm {
	name = "";
	userIds: number[] = [];
	isPublic: number;
	password = "";
}

const ChannelsView = (): JSX.Element => {
	const [channels, setChannels] = useState<Channel[]>([]);
	const [channelForm, setChannelForm] = useState<CreateChannelsForm>(
		new CreateChannelsForm(),
	);
	const [showForm, setShowForm] = useState<boolean>(false);
	const [usersAdded, setUsersAdded] = useState<User[]>([]);
	const { channel, setChannel } = SharedChatState();
	const { user, setUser } = SharedUserState();

	useEffect(() => {
		async function getChannels(): Promise<Channel[]> {
			let channels: Channel[] = await fetchData("/chat/public");

			const tmp: Channel[] = await fetchData("/user/me/chats");

			channels.push(...tmp);

			console.log(channels);
			channels = channels.filter((value, i, arr) => {
				console.log(
					"Finding",
					value.id,
					arr.findIndex((x) => x.id == value.id) === i,
				);
				return arr.findIndex((x) => x.id == value.id) === i;
			});

			setChannels(channels);
			return channels;
		}
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
					<Text color="black" fontSize="20px">
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

	function updatePrivacy(e: number): void {
		setChannelForm({ ...channelForm, isPublic: e });
	}

	async function uploadCreateChannel(): Promise<void> {
		const res: number = await postData("/chat/createNewChannel", channelForm);

		const chan: Channel = await fetchData(`/chat/get/${res}`);
		setChannel(chan);
		setShowForm(false);
	}

	const listUsersAdded = usersAdded.map(
		(user: User, key: number): JSX.Element => {
			return (
				<Text key={key} color="black">
					{user.userName}
				</Text>
			);
		},
	);

	const createGroupForm = (): JSX.Element => {
		return (
			<>
				<ChannelCreateContainer>
					<Text color="black">Name of group</Text>
					<TextInput
						type="text"
						onChange={(e) => {
							channelForm.name = e.target.value;
						}}
					/>
					<Text color="black">Privacy</Text>
					<input
						type="radio"
						name="privacy"
						value={"0"}
						onChange={(e) => updatePrivacy(parseInt(e.target.value))}
					/>
					Public
					<br />
					<input
						type="radio"
						name="privacy"
						value={"1"}
						onChange={(e) => updatePrivacy(parseInt(e.target.value))}
					/>
					Private
					<br />
					<input
						type="radio"
						name="privacy"
						value={"2"}
						onChange={(e) => updatePrivacy(parseInt(e.target.value))}
					/>
					Protected
					<br />
					{channelForm && channelForm.isPublic == 2 ? (
						<TextInput
							type="text"
							placeholder="Enter new password here"
							onChange={(e) => (channelForm.password = e.target.value)}
						></TextInput>
					) : (
						""
					)}
					<Text color="black">Search for users to add</Text>
					<AddUserInput
						placeholder="Type to search..."
						removeOnEnter={true}
						onValidUser={(e: User) => setUsersAdded([...usersAdded, e])}
					></AddUserInput>
					{usersAdded ? (
						<div>
							<Text color="black">Users to add</Text>
							{listUsersAdded}
						</div>
					) : (
						""
					)}
					<Button
						onClick={() => {
							uploadCreateChannel();
						}}
					>
						Create
					</Button>
					<Button
						onClick={() => {
							setShowForm(false);
							setUsersAdded([]);
						}}
					>
						Cancel
					</Button>
				</ChannelCreateContainer>
			</>
		);
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
				{showForm ? createGroupForm() : ""}
				{channels.length ? listChannels : <h2>No Channels Yet, Add one !</h2>}
			</List>
		</div>
	);
};

export default ChannelsView;
