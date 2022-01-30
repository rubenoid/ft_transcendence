import React, { useState } from "react";
import { Text } from "../../Utils/Text/Text";
import { fetchData, postData } from "../../../API/API";
import { Button } from "../../Utils/Buttons/Button/Button";
import { Channel, User } from "../../../Types/Types";
import { ChannelCreateContainer, RadioInput } from "./ChannelsViewElements";
import { TextInput } from "../../Utils/TextInput/TextInput";
import AddUserInput from "../../AddUserInput/AddUserInput";
import { Label } from "../../Utils/Label/Label";

interface InputParams {
	onSuccess(c: Channel): void;
	onFail(): void;
}

class CreateChannelsForm {
	name = "";
	users: User[] = [];
	isPublic = 0;
	password = "";
}

const CreateGroupForm = (props: InputParams): JSX.Element => {
	const [channelForm, setChannelForm] = useState<CreateChannelsForm>(
		new CreateChannelsForm(),
	);

	const listUsersAdded = channelForm.users.map(
		(user: User, key: number): JSX.Element => {
			return <Text key={key}>{user.userName}</Text>;
		},
	);

	function updatePrivacy(e: number): void {
		setChannelForm({ ...channelForm, isPublic: e });
	}

	async function uploadCreateChannel(): Promise<void> {
		const res: number = await postData("/chat/createNewChannel", channelForm);

		const chan: Channel = await fetchData(`/chat/get/${res}`);
		setChannelForm(new CreateChannelsForm());
		props.onSuccess(chan);
	}

	return (
		<>
			<ChannelCreateContainer>
				<Text>Name of group</Text>
				<TextInput
					type="text"
					onChange={(e) => {
						channelForm.name = e.target.value;
					}}
				/>
				<Text>Privacy</Text>
				<RadioInput
					type="radio"
					name="createPrivacy"
					value={"0"}
					defaultChecked
					onChange={(e) => updatePrivacy(0)}
				/>
				<Label>Public</Label>
				<RadioInput
					type="radio"
					name="createPrivacy"
					value={"1"}
					onChange={(e) => updatePrivacy(1)}
				/>
				<Label>Private</Label>
				<RadioInput
					type="radio"
					name="createPrivacy"
					value={"2"}
					onChange={(e) => updatePrivacy(2)}
				/>
				<Label>Protected</Label>
				{channelForm && channelForm.isPublic == 2 ? (
					<TextInput
						type="text"
						placeholder="Enter new password here"
						onChange={(e) => (channelForm.password = e.target.value)}
					></TextInput>
				) : (
					""
				)}
				<Text>Search for users to add</Text>
				<AddUserInput
					placeholder="Type to search..."
					removeOnEnter={true}
					onValidUser={(e: User) =>
						setChannelForm((prevState) => {
							prevState.users.push(e);
							return { ...prevState };
						})
					}
				></AddUserInput>
				{channelForm.users ? (
					<div>
						<Text>Users to add</Text>
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
						props.onFail();
						setChannelForm(new CreateChannelsForm());
					}}
				>
					Cancel
				</Button>
			</ChannelCreateContainer>
		</>
	);
};

export default CreateGroupForm;
