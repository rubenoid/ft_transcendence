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
	TopButtonsContainer,
} from "./ChatBoxElements";
import { ChatContainer } from "./ChatBoxElements";
// import { ChatContainer } from "../ChatElements";
import { AiOutlineSend as SendIcon } from "react-icons/ai";
import { fetchData, postData } from "../../../API/API";
import { Channel, Message } from "../../../Types/Types";
import { Button } from "../../Utils/Buttons/Button/Button";
import { TextInput } from "../../Utils/TextInput/TextInput";
import { Text } from "../../Utils/Text/Text";
import socket from "../../../API/Socket";
import { SharedChatState } from "../SideBar";
import { SharedUserState } from "../../../App/UserStatus";
import { Link } from "react-router-dom";
import { outputChatName } from "../SideBar";

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
			<div key={key}>
				{msg.senderId != user.id ? (
					<MsgContainerOther>
						<MsgText color="black">{msg.data}</MsgText>
					</MsgContainerOther>
				) : (
					<MsgContainer>
						<MsgText color="black">{msg.data}</MsgText>
					</MsgContainer>
				)}
			</div>
		);
	});

	const addToHistory = async (): Promise<void> => {
		if (msgToSend) {
			socket.emit("addChatMessage", { data: msgToSend, chatId: channel.id });
			setMsgToSend("");
		}
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

	function enterCheck(keyCode: string): void {
		if (keyCode == "Enter") addToHistory();
	}

	return (
		<>
			{!channel ? (
				""
			) : (
				<ChatBoxContainer>
					<TopContainer>
						<TopText>{outputChatName(channel, user, channel.name)}</TopText>
						<TopButtonsContainer>
							<Link to={`/chat/${channel.id}`}>
								<TopText>⚙</TopText>
							</Link>
							<TopText onClick={() => setChannel(undefined)}>✕</TopText>
						</TopButtonsContainer>
					</TopContainer>
					{passwordNeeded ? (
						<>
							<Text>Enter Password</Text>
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
						<ChatContainer>{history.length ? history : ""}</ChatContainer>
					)}
					<InputContainer>
						<TextInput
							type="text"
							value={msgToSend}
							onKeyDown={(e) => enterCheck(e.key)}
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
