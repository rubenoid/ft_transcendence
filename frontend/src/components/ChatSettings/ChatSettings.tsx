import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { SettingsContainer } from "../Settings/SettingsElements";
import { User } from "../../Types/Types";
import { fetchData, postData } from "../../API/API";
import { Text } from "../Utils/Text/Text";
import { Button } from "../Utils/Buttons/Button/Button";
import {
	UserWrapper,
	UserRow,
	RowButton,
	UserRowContainer,
} from "./ChatSettingsElements";
import { SharedUserState } from "../Profile/Profile";

interface ChatData {
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

const ChatSettings = (): JSX.Element => {
	const navigate = useNavigate();
	const { chatId } = useParams();
	const [chatData, setChatData] = useState<ChatData>(undefined);
	const [myRole, setMyRole] = useState<roleLevel>(0);
	const { user, setUser } = SharedUserState();
	const [endpoints, setEndpoints] = useState<toSend[]>([]);
	/*

	*/
	useEffect(() => {
		async function setShit(): Promise<void> {
			setChatData(await fetchData(`/chat/get/${chatId}`));
		}
		setShit();
	}, [chatId]);

	useEffect(() => {
		if (!chatData) return;
		console.log("MY USER ID XDDDD", user.id, chatData);
		if (user.id == chatData.owner) {
			setMyRole(roleLevel.owner);
		} else if (chatData.admins.find((x) => x.id == user.id)) {
			setMyRole(roleLevel.admin);
		} else {
			setMyRole(roleLevel.user);
		}
	}, [chatData]);

	const listUsers = (): JSX.Element[] => {
		return chatData.users.map((mapUser: User, key: number) => {
			return (
				<UserRowContainer key={key}>
					<Link to={`/profile/${mapUser.id}`}>
						<Text>{mapUser.userName}</Text>
					</Link>
					{chatData.admins.find((x) => x.id == mapUser.id) ? "ADMIN" : ""}
					{myRole != roleLevel.user ? (
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

	function saveChatSettings(): void {
		for (const e of endpoints) {
			postData(e.endpoint, e.data);
		}
		navigate("/", { replace: false });
	}

	function updatePrivacy(e: number): void {
		return;
	}

	const displaySettings = (): JSX.Element => {
		return (
			<>
				<Text fontSize="20px"></Text>
				<Text>Change Name</Text>
				<input type={"text"} placeholder={chatData.name}></input>
				<Text>Change Visibility</Text>
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

				<br />

				<UserWrapper>{displaySettings()}</UserWrapper>

				<Button onClick={() => saveChatSettings()}>Save</Button>
				<Button>Back</Button>
				{chatData.isPublic ? <Button>Leave</Button> : ""}
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
