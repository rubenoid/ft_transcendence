import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
	MainContentWrapper,
	FooterWrapper,
	HeaderWrapper,
	MainViewContainer,
} from "../Utils/Containers/Containers";
import { User, ChatData, ToSend } from "../../Types/Types";
import { fetchData, postData } from "../../API/API";
import { Text, Header } from "../Utils/Text/Text";
import { Button } from "../Utils/Buttons/Button/Button";
import { LinkButton } from "../Utils/Buttons/Button/LinkButton";
import AddUserInput from "../AddUserInput/AddUserInput";
import { UserWrapper, UserRowContainer } from "./ChatSettingsElements";
import { SharedGlobalUser } from "../../App/GlobalUser";
import UserList from "./UserList";
import PunishedList from "./PunishedList";
import OwnerSettings from "./OwnerSettings";

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
	const { user, setUser } = SharedGlobalUser();
	const [endpoints, setEndpoints] = useState<ToSend[]>([]);
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

	const displayChat = (): JSX.Element => {
		return (
			<>
				<HeaderWrapper>
					<Header>{chatData.name} details</Header>
					{chatData.owner == -1 ? (
						<Text color="pink">Direct channel</Text>
					) : chatData.isPublic ? (
						<Text color={"green"}> Public Channel</Text>
					) : (
						<Text color={"blue"}> Private Channel</Text>
					)}
				</HeaderWrapper>
				<MainContentWrapper>
					<UserList
						chatData={chatData}
						myRole={myRole}
						setEndpoints={setEndpoints}
						chatId={chatId}
					></UserList>

					{myRole != roleLevel.user ? (
						<>
							<UserWrapper>
								<Text>Add Users</Text>
								<AddUserInput
									removeOnEnter={true}
									placeholder={"Enter username"}
									onValidUser={(e: User) => {
										setUsersToAdd([...usersToAdd, e]);
									}}
								/>
								<br />
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
						</>
					)}
				</MainContentWrapper>
				<FooterWrapper>
					<LinkButton to={-1}>
						<Text>Back</Text>
					</LinkButton>
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
				</FooterWrapper>
			</>
		);
	};

	return (
		<MainViewContainer>
			{chatData ? displayChat() : "loading"}
		</MainViewContainer>
	);
};

export default ChatSettings;
