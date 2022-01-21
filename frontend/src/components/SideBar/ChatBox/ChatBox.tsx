import React, { useEffect, useState } from "react";
import {
	TopContainer,
	ChatBoxContainer,
	InputContainer,
	SendIconContainer,
	MsgContainer,
	MsgContainerOther,
	MsgText,
} from "./ChatBoxElements";
import { ChatContainer } from "./ChatBoxElements";
// import { ChatContainer } from "../ChatElements";
import { AiOutlineSend as SendIcon } from "react-icons/ai";
import { fetchData, postData } from "../../../API/API";
import { Channel, Message } from "../../../Types/Types";
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
	const { channel, setChannel } = SharedChatState();
	const { user, setUser } = SharedUserState();

	useEffect(() => {
		if (!channel) return;
		async function getMessages(): Promise<void> {
			const messages: Message[] = await fetchData(
				`chat/messages/${channel.id}`,
			);
			msgHistory.push(...messages);
			setMsgHistory([...msgHistory]);
		}

		function recieveMessage(msg: Message): void {
			if (channel) {
				msgHistory.push(msg);
				setMsgHistory([...msgHistory]);
			}
		}

		socket.on("newMessage", recieveMessage);

		getMessages();
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

	return (
		<>
			{!channel ? (
				""
			) : (
				<ChatBoxContainer>
					<TopContainer>
						<Text>{channel.name}</Text>
					</TopContainer>
					<ChatContainer>
						{history.length ? (
							history
						) : (
							<Text color="white">Send your first message !</Text>
						)}
					</ChatContainer>
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
