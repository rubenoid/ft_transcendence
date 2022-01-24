import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { SettingsContainer } from "../Settings/SettingsElements";
import { User } from "../../Types/Types";
import { fetchData, postData } from "../../API/API";
import { Text } from "../Utils/Text/Text";
import { Button } from "../Utils/Buttons/Button/Button";
import { TextInput } from "../Utils/TextInput/TextInput";
import AddUserInput from "../AddUserInput/AddUserInput";
import {
	UserWrapper,
	UserRow,
	RowButton,
	UserRowContainer,
} from "./ChatSettingsElements";
import { SharedUserState } from "../Profile/Profile";

interface ChatData {
	id: number;
	hasPassword: boolean;
	isPublic: boolean;
	name: string;
	users: User[];
	admins: User[];
	owner: number;
}

interface toSend {
	endpoint: string;
	data: object;
}

enum roleLevel {
	user = 0,
	admin = 1,
	owner = 2,
}

class ChatSettingsForm {
	constructor(id: number, name: string, priv: number) {
		this.name = name;
		this.privacyLevel = priv;
		this.password = "";
		this.chatId = id;
	}
	chatId: number;
	name: string;
	privacyLevel: number;
	password: string;
}

const ChatSettings = (): JSX.Element => {
	const navigate = useNavigate();
	const { chatId } = useParams();
	const [chatData, setChatData] = useState<ChatData>(undefined);
	const [myRole, setMyRole] = useState<roleLevel>(0);
	const { user, setUser } = SharedUserState();
	const [endpoints, setEndpoints] = useState<toSend[]>([]);
	const [usersToAdd, setUsersToAdd] = useState<User[]>([]);
	const [settingsForm, setSettingsForm] = useState<ChatSettingsForm>(undefined);
	/*

	*/
	useEffect(() => {
		async function setShit(): Promise<void> {
			setChatData(await fetchData(`/chat/getDetailed/${chatId}`));
		}
		setShit();
	}, [chatId]);

	useEffect(() => {
		if (!chatData) return;
		if (user.id == chatData.owner) {
			setMyRole(roleLevel.owner);
		} else if (chatData.admins.find((x) => x.id == user.id)) {
			setMyRole(roleLevel.admin);
		} else {
			setMyRole(roleLevel.user);
		}
		setSettingsForm(
			new ChatSettingsForm(
				chatData.id,
				chatData.name,
				Number(!chatData.isPublic) + Number(chatData.hasPassword),
			),
		);
	}, [chatData]);

	const listUsers = (): JSX.Element[] => {
		return chatData.users.map((mapUser: User, key: number) => {
			return (
				<UserRowContainer key={key}>
					<Link to={`/profile/${mapUser.id}`}>
						<Text>{mapUser.userName}</Text>
					</Link>
					{chatData.owner == mapUser.id
						? "OWNER"
						: chatData.admins.find((x) => x.id == mapUser.id)
						? "ADMIN"
						: ""}
					{myRole != roleLevel.user && mapUser.id != user.id ? (
						<UserRow>
							{chatData.admins.find((x) => x.id != mapUser.id) ? (
								<RowButton
									onClick={() => {
										endpoints.push({
											endpoint: "/chat/addAdmin/",
											data: { newAdminId: mapUser.id, chatId: chatId },
										});
									}}
								>
									Promote
								</RowButton>
							) : (
								""
							)}
							<RowButton
								onClick={() => {
									endpoints.push({
										endpoint: "/chat/leave",
										data: { chatId: chatId, idToRemove: mapUser.id },
									});
								}}
							>
								Ban
							</RowButton>
							<RowButton>Mute</RowButton>
						</UserRow>
					) : (
						""
					)}
				</UserRowContainer>
			);
		});
	};

	const listAddedUsers = usersToAdd.map((user: User, key: number) => {
		return (
			<UserRowContainer key={key}>
				<Text>{user.userName}</Text>
			</UserRowContainer>
		)
	})


	function saveChatSettings(): void {
		if (
			settingsForm.name != chatData.name ||
			settingsForm.privacyLevel !=
				Number(!chatData.isPublic) + Number(chatData.hasPassword)
		)
			postData("/chat/updateChat", settingsForm);
		for (const e of endpoints) {
			postData(e.endpoint, e.data);
		}
		for (const e of usersToAdd) {
			postData("/chat/addUser", {userId: e.id, chatId: chatId});
		}
		navigate("/", { replace: false });
	}

	function updatePrivacy(e: number): void {
		setSettingsForm({ ...settingsForm, privacyLevel: e });
	}

	const displaySettings = (): JSX.Element => {
		return (
			<>
				<Text fontSize="20px">Settings</Text>
				<Text>Change Name</Text>
				<TextInput
					type={"text"}
					placeholder={settingsForm.name}
					onChange={(e) =>
						setSettingsForm({ ...settingsForm, name: e.target.value })
					}
				></TextInput>
				<Text>Change Visibility</Text>
				<input
					type="radio"
					name="privacy"
					value={"0"}
					checked={settingsForm.privacyLevel == 0}
					onChange={(e) => updatePrivacy(parseInt(e.target.value))}
				/>
				Public
				<br />
				<input
					type="radio"
					name="privacy"
					value={"1"}
					checked={settingsForm.privacyLevel == 1}
					onChange={(e) => updatePrivacy(parseInt(e.target.value))}
				/>
				Private
				<br />
				<input
					type="radio"
					name="privacy"
					value={"2"}
					checked={settingsForm.privacyLevel == 2}
					onChange={(e) => updatePrivacy(parseInt(e.target.value))}
				/>
				Protected
				<br />
				{settingsForm.privacyLevel == 2 ? (
					<TextInput
						placeholder="Enter new password"
						onChange={(e) =>
							setSettingsForm({ ...settingsForm, password: e.target.value })
						}
					/>
				) : (
					""
				)}
			</>
		);
	};

	const displayChat = (): JSX.Element => {
		return (
			<>
				<h1>{chatData.name} details</h1>
				{chatData.isPublic ? (
					<Text color={"green"}> Public Channel</Text>
				) : (
					<Text color={"blue"}> Private Channel</Text>
				)}
				<Text color="black">Users</Text>
				<UserWrapper>{listUsers()}</UserWrapper>

				{myRole != roleLevel.user ? (
					<>
						<Text color="black">Add Users</Text>
						<UserWrapper>
							<AddUserInput
								removeOnEnter={true}
								placeholder={"Enter username"}
								onValidUser={(e: User) => {
									setUsersToAdd([...usersToAdd, e]);
								}}
							/>
							<br />
							<hr />
							{usersToAdd ? listAddedUsers : ""}
						</UserWrapper>
					</>
				) : (
					""
				)}
				<br />

				<UserWrapper>{settingsForm ? displaySettings() : ""}</UserWrapper>

				<Button onClick={() => saveChatSettings()}>Save</Button>
				<Button
					onClick={() => {
						navigate("/", { replace: true });
					}}
				>
					Back
				</Button>
				<Button
					onClick={() => {
						postData("/chat/leave", { chatId: chatId, idToRemove: user.id });
						navigate("/", { replace: true });
					}}
				>
					Leave
				</Button>
			</>
		);
	};

	return (
		<SettingsContainer>
			{chatData ? displayChat() : "loading"}
		</SettingsContainer>
	);
};

export default ChatSettings;
