import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { SettingsContainer } from "../Settings/SettingsElements";
import { User } from "../../Types/Types";
import { fetchData, postData } from "../../API/API";
import { Text } from "../Utils/Text/Text";
import { Button } from "../Utils/Buttons/Button/Button";
import AddUserInput from "../AddUserInput/AddUserInput";
import EndpointButton from "../EndpointButton/EndpointButton";
import { UserWrapper, UserRowContainer } from "./ChatSettingsElements";
import { SharedUserState } from "../../App/UserStatus";
import UserList from "./UserList";
import PunishedList from "./PunishedList";
import OwnerSettings from "./OwnerSettings";

export interface ChatData {
	id: number;
	hasPassword: boolean;
	isPublic: boolean;
	name: string;
	users: User[];
	admins: User[];
	bannedUsers: User[];
	muted: mutedUser[];
	owner: number;
}

export interface toSend {
	endpoint: string;
	data: object;
}

export interface mutedUser {
	userTargetId: number;
	endDate: number;
}

export enum roleLevel {
	user = 0,
	admin = 1,
	owner = 2,
}

export class ChatSettingsForm {
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

	async function loadChatDetails(): Promise<void> {
		setChatData(await fetchData(`/chat/getDetailed/${chatId}`));
	}
	useEffect(() => {
		loadChatDetails();
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
				Number(chatData.isPublic) + Number(chatData.hasPassword),
			),
		);
	}, [chatData]);

	const listAddedUsers = usersToAdd.map((user: User, key: number) => {
		return (
			<UserRowContainer key={key}>
				<Text>{user.userName}</Text>
			</UserRowContainer>
		);
	});

	async function saveChatSettings(): Promise<void> {
		if (
			settingsForm.name != chatData.name ||
			settingsForm.privacyLevel !=
				Number(chatData.isPublic) + Number(chatData.hasPassword)
		)
			await postData("/chat/updateChat", settingsForm);
		for (const e of endpoints) {
			await postData(e.endpoint, e.data);
		}
		for (const e of usersToAdd) {
			await postData("/chat/addUser", { userId: e.id, chatId: chatId });
		}
		setEndpoints([]);
		loadChatDetails();
	}

	// function updatePrivacy(e: number): void {
	// 	setSettingsForm({ ...settingsForm, privacyLevel: e });
	// }

	// const displaySettings = (): JSX.Element => {
	// 	return (
	// 		<>
	// 			<Text fontSize="20px" color="black">Settings</Text>
	// 			<Text>Change Name</Text>
	// 			<TextInput
	// 				type={"text"}
	// 				placeholder={settingsForm.name}
	// 				onChange={(e) =>
	// 					setSettingsForm({ ...settingsForm, name: e.target.value })
	// 				}
	// 			></TextInput>
	// 			<Text>Change Visibility</Text>
	// 			<input
	// 				type="radio"
	// 				name="privacy"
	// 				value={"1"}
	// 				checked={settingsForm.privacyLevel == 1}
	// 				onChange={(e) => updatePrivacy(parseInt(e.target.value))}
	// 			/>
	// 			Public
	// 			<br />
	// 			<input
	// 				type="radio"
	// 				name="privacy"
	// 				value={"0"}
	// 				checked={settingsForm.privacyLevel == 0}
	// 				onChange={(e) => updatePrivacy(parseInt(e.target.value))}
	// 			/>
	// 			Private
	// 			<br />
	// 			<input
	// 				type="radio"
	// 				name="privacy"
	// 				value={"2"}
	// 				checked={settingsForm.privacyLevel == 2}
	// 				onChange={(e) => updatePrivacy(parseInt(e.target.value))}
	// 			/>
	// 			Protected
	// 			<br />
	// 			{settingsForm.privacyLevel == 2 ? (
	// 				<TextInput
	// 					placeholder="Enter new password"
	// 					onChange={(e) =>
	// 						setSettingsForm({ ...settingsForm, password: e.target.value })
	// 					}
	// 				/>
	// 			) : (
	// 				""
	// 			)}
	// 		</>
	// 	);
	// };

	const displayChat = (): JSX.Element => {
		return (
			<>
				<h1>{chatData.name} details</h1>
				{chatData.owner == -1 ? (
					<Text color="pink">Direct channel</Text>
				) : chatData.isPublic ? (
					<Text color={"green"}> Public Channel</Text>
				) : (
					<Text color={"blue"}> Private Channel</Text>
				)}

				<UserList
					chatData={chatData}
					myRole={myRole}
					setEndpoints={setEndpoints}
					chatId={chatId}
				></UserList>

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
				{chatData.owner == -1 ? (
					""
				) : (
					<>
						<PunishedList
							chatData={chatData}
							myRole={myRole}
							setEndpoints={setEndpoints}
							mutedUsers={chatData.muted}
							bannedUsers={chatData.bannedUsers}
							chatId={chatId}
						/>
						<OwnerSettings
							settingsForm={settingsForm}
							setSettingsForm={setSettingsForm}
							myRole={myRole}
						></OwnerSettings>
						{/* <UserWrapper>
							{settingsForm && myRole == roleLevel.owner
								? displaySettings()
								: ""}
						</UserWrapper> */}
					</>
				)}

				<Button
					onClick={() => {
						console.log(endpoints);
						navigate("/", { replace: true });
					}}
				>
					Back
				</Button>
				{chatData.owner != -1 ? (
					<>
						<Button onClick={() => saveChatSettings()}>Save</Button>
						<Button
							onClick={() => {
								postData("/chat/leave", {
									chatId: chatId,
									idToRemove: user.id,
								});
								navigate("/", { replace: true });
							}}
						>
							Leave
						</Button>
					</>
				) : (
					""
				)}
			</>
		);
	};

	return (
		<SettingsContainer>
			{chatData ? displayChat() : "loading"}
			{JSON.stringify(endpoints)}
		</SettingsContainer>
	);
};

export default ChatSettings;
