import React, { useEffect, useState } from "react";
import { fetchData } from "../../../API/API";
import { Message } from "../../../Types/Types";
import socket from "../../../API/Socket";
import { SharedChatState } from "../SideBar";
import { SharedGlobalUser } from "../../../App/GlobalUser";
import { outputChatName } from "../SideBar";
import MinimizedChatBox from "./MinimizedChatBox";
import OpenChatContainer from "./OpenChatContainer";

const ChatBox = (): JSX.Element => {
	const [msgHistory, setMsgHistory] = useState<Message[]>([]);
	const [passwordNeeded, setPasswordNeeded] = useState<boolean>(false);

	const [isMinimized, setMinimized] = useState<boolean>(false);
	const { channel, setChannel } = SharedChatState();
	const { user, setUser } = SharedGlobalUser();

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
