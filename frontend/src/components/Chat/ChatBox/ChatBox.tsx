import React, { useEffect, useState } from "react";
import {
	TopContainer,
	ChatBoxContainer,
	InputContainer,
	SendIconContainer,
} from "./ChatBoxElements";
import { TextInput, Text, List, LongList, Item } from "../../Utils/Utils";
import { ChatContainer } from "../ChatElements";
import { AiOutlineSend as SendIcon } from "react-icons/ai";
import { User, fetchData, postData } from "../../../API/API";
import { Channel, Message } from "../Chat";

type ChatBoxProps = {
	chatWith: Channel;
};

const ChatBox = (props: ChatBoxProps): JSX.Element => {
	const [msgToSend, setMsgToSend] = useState<string>("");
	const [msgHistory, setMsgHistory] = useState<Message[]>([]);

	useEffect(() => {
		async function getMessages(): Promise<void> {
			const messages: Message[] = await fetchData(
				`chat/messages/${props.chatWith.id}`,
			);

			console.log("messges:", messages);
			setMsgHistory(messages);
		}
		getMessages();
	}, [props.chatWith]);

	const history = msgHistory.map((msg: Message, key: number) => {
		return (
			<Item key={key}>
				<Text color="black">{msg.data}</Text>
			</Item>
		);
	});

	const addToHistory = async (): Promise<void> => {
		msgHistory.push({ data: msgToSend, senderId: -1 });

		await postData("chat/addChatMessage", {
			data: msgToSend,
			chatId: props.chatWith.id,
		});
		setMsgToSend("");
	};

	return (
		<ChatBoxContainer>
			<TopContainer>
				<Text>{props.chatWith.name}</Text>
			</TopContainer>
			<ChatContainer>
				{history.length ? (
					history
				) : (
					<Text color="black">Send your first message !</Text>
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
	);
};

export default ChatBox;
