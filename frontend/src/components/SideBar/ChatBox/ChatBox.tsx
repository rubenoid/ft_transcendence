import React, { useEffect, useState } from "react";
import {
	TopContainer,
	ChatBoxContainer,
	InputContainer,
	SendIconContainer,
	MsgContainer,
	MsgContainerOther,
	MsgText,
	TopText,
} from "./ChatBoxElements";
import { ChatContainer } from "./ChatBoxElements";
// import { ChatContainer } from "../ChatElements";
import { AiOutlineSend as SendIcon } from "react-icons/ai";
import { fetchData, postData } from "../../../API/API";
import { Channel, Message } from "../../../Types/Types";
import { Button } from "../../Utils/Buttons/Button/Button";
import { TextInput } from "../../Utils/TextInput/TextInput";
import { Text } from "../../Utils/Text/Text";
import socket from "../../socket";
import { SharedChatState } from "../SideBar";
import { SharedUserState } from "../../Profile/Profile";
// type ChatBoxProps = {
// 	// chatWith: React.Dispatch<React.SetStateAction<Channel>>;
// };

const ChatBox = (): JSX.Element => {
	const [msgToSend, setMsgToSend] = useState<string>("");
	const [msgHistory, setMsgHistory] = useState<Message[]>([]);
	const [passwordNeeded, setPasswordNeeded] = useState<boolean>(false);
	const [password, setPassword] = useState<string>("");
	const { channel, setChannel } = SharedChatState();
	const { user, setUser } = SharedUserState();

	useEffect(() => {
		if (!channel) return;
		async function getMessages(): Promise<void> {
			try {
				const messages: Message[] = await fetchData(
					`chat/messages/${channel.id}`,
				);
				msgHistory.length = 0;
				msgHistory.push(...messages);
				setMsgHistory([...msgHistory]);
			} catch (er) {
				console.log("NO ACCESIO");
				setPasswordNeeded(true);
			}
		}

		getMessages();
	}, [channel, passwordNeeded]);

	useEffect(() => {
		function recieveMessage(msg: Message): void {
			if (channel && channel.id == msg.channelId) {
				msgHistory.push(msg);
				setMsgHistory([...msgHistory]);
			}
		}

		socket.on("newMessage", recieveMessage);
	}, [channel]);

	const history = msgHistory.map((msg: Message, key: number) => {
		return (
			<>
				{msg.senderId != user.id ? (
					<MsgContainerOther key={key}>
						<MsgText color="black">{msg.data}</MsgText>
					</MsgContainerOther>
				) : (
					<MsgContainer key={key}>
						<MsgText color="black">{msg.data}</MsgText>
					</MsgContainer>
				)}
			</>
		);
	});

	const addToHistory = async (): Promise<void> => {
		socket.emit("addChatMessage", { data: msgToSend, chatId: channel.id });
		setMsgToSend("");
	};

	const outputChatName = (): string => {
		let ret: string;
		ret = channel.name.replace(user.userName + ",", "");
		ret = ret.replace(", " + user.userName, "");
		return ret;
	};

	async function checkProtected(): Promise<void> {
		const res: boolean = await postData("/chat/enterProtected", {
			chatId: channel.id,
			password: password,
		});

		console.log("RESULTA PASWORDA", res);
		if (res === true) {
			setPasswordNeeded(false);
			setChannel(channel);
		}
		setPassword("");
	}

	return (
		<>
			{!channel ? (
				""
			) : (
				<ChatBoxContainer>
					<TopContainer>
						<TopText>{outputChatName()}</TopText>
						<TopText onClick={() => setChannel(undefined)}>✕</TopText>
					</TopContainer>
					{passwordNeeded ? (
						<>
							<Text color="black">Enter Password</Text>
							<TextInput
								type="text"
								value={password}
								onChange={(e) => {
									setPassword(e.target.value);
								}}
							></TextInput>
							<Button
								onClick={() => {
									checkProtected();
								}}
							>
								Send
							</Button>
						</>
					) : (
						<ChatContainer>
							{history.length ? (
								history
							) : (
								<Text color="black">Send your first message !</Text>
							)}
						</ChatContainer>
					)}
					<InputContainer>
						<TextInput
							type="text"
							value={msgToSend}
							onChange={(e) => {
								setMsgToSend(e.target.value);
							}}
						></TextInput>
						<SendIconContainer
							onClick={() => {
								addToHistory();
							}}
						>
							<SendIcon />
						</SendIconContainer>
					</InputContainer>
				</ChatBoxContainer>
			)}
		</>
	);
};

export default ChatBox;
