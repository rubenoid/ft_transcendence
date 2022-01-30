import React, { useEffect, useState } from "react";
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
import { FaWindowMinimize } from "react-icons/fa";
import MinimizedChatBox from "./MinimizedChatBox";
import OpenChatContainer from "./OpenChatContainer";

const ChatBox = (): JSX.Element => {
	const [msgHistory, setMsgHistory] = useState<Message[]>([]);
	const [passwordNeeded, setPasswordNeeded] = useState<boolean>(false);

	const [isMinimized, setMinimized] = useState<boolean>(false);
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

	return (
		<>
			{!channel ? (
				""
			) : isMinimized ? (
				<MinimizedChatBox
					chatName={outputChatName(channel, user, channel.name)}
					onClose={() => setChannel(undefined)}
					onMinimizeClick={() => setMinimized(false)}
				/>
			) : (
				<OpenChatContainer
					msgHistory={msgHistory}
					passwordNeeded={passwordNeeded}
					setPasswordNeeded={setPasswordNeeded}
					setMinimized={setMinimized}
				/>
			)}
		</>
	);
};

export default ChatBox;
