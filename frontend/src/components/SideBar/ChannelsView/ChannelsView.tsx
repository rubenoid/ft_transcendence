import React, { useState, useEffect } from "react";
import { Text } from "../../Utils/Text/Text";
import { fetchData, postData } from "../../../API/API";
import { List, Item } from "../../Utils/List/List";
import { Button } from "../../Utils/Buttons/Button/Button";
import { Channel, User } from "../../../Types/Types";
import { SharedChatState } from "../SideBar";
import { ChannelTitleContainer, ChannelCreateContainer } from './ChannelsViewElements';
import { TextInput } from "../../Utils/TextInput/TextInput";
import { SearchResultContainer } from "../../AddFriend/AddFriendElements";
import { Form } from "../../ConnectionForm/ConnectionFormElements";

class CreateChannelsForm {
	name: string = "";
	userIds: number[] = [];
	isPublic: number;
	password: string = "";
}

const ChannelsView = (): JSX.Element => {
	const [channels, setChannels] = useState<Channel[]>([]);
	const [channelForm, setChannelForm] = useState<CreateChannelsForm>(new CreateChannelsForm);
	const [showForm, setShowForm] = useState<boolean>(false);
	const [userSearched, setUserSearched] = useState<User>(undefined);
	const [usersAdded, setUsersAdded] = useState<User[]>([]);
	const { channel, setChannel } = SharedChatState();
	const [userToAddText, setUserToAddText] = useState<string>("");

	useEffect(() => {
		async function getChannels(): Promise<Channel[]> {

			const channels: Channel[] = await fetchData("/chat/public");
			
			const tmp: Channel[] = await fetchData("/user/me/chats");

			channels.push(...tmp);

			channels.filter((value, i, arr) => arr.findIndex(x => x.id == value.id) === i);

			console.log("USERS-d>ddb", channels);

			setChannels(channels);
			return channels;
		}
		getChannels();
	}, []);

	async function openChat(id: number): Promise<void> {
		const channelData: Channel = await fetchData(`/chat/get/${id}`);

		setChannel(channelData);
	}

	async function addNewGroup(): Promise<void> {
		
	}

	const listChannels = channels.map((channel: Channel, key: number) => {
		return (
			<Item key={channel.id}>
				<Button
					onClick={() => {
						openChat(channel.id);
					}}
				>
					{channel.name}
				</Button>
			</Item>
		);
	});

	/*
		- add users,
		- public, private, protected (password)
		- name
		- create button
	*/
	const handleChangeSearch = (e: string): void => {
		setUserToAddText(e);
		async function getUser4Change(): Promise<User> {
			const endpoint = `/user/getByUserName/${e}`;
			const user: User = await fetchData(endpoint);
			if (user) {
				setUserSearched(user);
			}
			return user;
		}
		getUser4Change();
	};


	const SearchResult = (
		user2add: User,
		whatToChange: string,
	): JSX.Element => {
		return (
			<SearchResultContainer>
				<Text>{user2add.userName}</Text>
				<Button
					onClick={() => {
						channelForm.userIds.push(user2add.id);
						usersAdded.push(user2add);
						setUsersAdded([...usersAdded]);
						setUserSearched(undefined);
						setUserToAddText("");
					}}
				>
					Add
				</Button>
			</SearchResultContainer>
		);
	};

	function updatePrivacy(e: any) {
		setChannelForm({...channelForm, isPublic: e.currentTarget.value});
	}

	async function uploadCreateChannel() {
		const res: number = await postData("/chat/createNewChannel", channelForm);

		const chan: Channel = await fetchData(`/chat/get/${res}`);
		setChannel(chan);
		setShowForm(false);
	}

	const listUsersAdded = usersAdded.map((user: User, key: number) => {
		return (
			<Text key={key} color="black">{user.userName}</Text>
		);
	});


	const createGroupForm = () => {
		return (
			<>
				<ChannelCreateContainer>
					<Text color="black">Name of group</Text>
					<TextInput type="text" onChange={(e) => {channelForm.name = e.target.value}}/>
					<Text color="black">Privacy</Text>
					<input type="radio" name="privacy" value={0} onChange={updatePrivacy} />Public<br />
					<input type="radio" name="privacy" value={1} onChange={updatePrivacy} />Private<br />
					<input type="radio" name="privacy" value={2} onChange={updatePrivacy} />Protected<br />
					{channelForm && channelForm.isPublic == 2 ? (
						<TextInput
							type="text"
							placeholder="Type to search..."
							onChange={(e) => channelForm.password = e.target.value}>
						</TextInput>
					) : ''}
					<Text color="black">Search for users to add</Text>
						<TextInput
							type="text"
							placeholder="Type to search..."
							value={userToAddText}
							onChange={(e) => handleChangeSearch(e.target.value)}>	
						</TextInput>
						{userSearched ? SearchResult(userSearched, "") : ""}
						{usersAdded ? listUsersAdded : "" }
						
					<Button onClick={() => {uploadCreateChannel()}}>Create</Button>
					<Button onClick={() => {setShowForm(false)}}>Cancel</Button>
				</ChannelCreateContainer>
			</>

		)
	}

	return (
		<div>
			<List>
				<ChannelTitleContainer>
					<div>
						<Text>Channels</Text>
						<Text>Create a new group</Text>
					</div>
					<Button onClick={() => {setShowForm(true)}}>+</Button>
				</ChannelTitleContainer>
				{showForm ? createGroupForm() : ""}
				{channels.length ? listChannels : <h2>No Channels Yet, Add one !</h2>}
			</List>
		</div>
	);
};

export default ChannelsView;
