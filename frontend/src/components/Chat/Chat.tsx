import React, { useState } from "react";
import { ChatGrid, ChatContainer } from "./ChatElements";
import { Text, TextInput, WidgetContainer } from "../Utils/Utils";
import { List, LongList, Item } from "../Utils/Utils";
import ChatBox from "./ChatBox/ChatBox";
import ChatSideBar from "./ChatSideBar/ChatSideBar";
import { User } from "../../API/API";

export interface Message {
	data: string;
	senderId: number;
}

export interface Channel {
	id: number;
	name: string;
	users: User[];
	messages: Message[];
}

const Chat = (): JSX.Element => {
	const [selectedUser, setSelectedUser] = useState<Channel>();
	console.log("SELECTED_USER->", selectedUser);

	return (
		<ChatGrid>
			<ChatSideBar setSelectedUser={setSelectedUser} />
			{selectedUser ? <ChatBox chatWith={selectedUser} /> : ""}
		</ChatGrid>
	);
};

export default Chat;
