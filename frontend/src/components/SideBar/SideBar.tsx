import React, { useState } from "react";
import { SideBarContainer, SideViewWrapper, Hr } from "./SideBarElements";
import { Button } from "../Utils/Buttons/Button/Button";
import FriendsView from "./FriendsView/FriendsView";
import ChannelsView from "./ChannelsView/ChannelsView";
import UserView from "./UserView/UserView";
import { Channel } from "../../Types/Types";
import ChatBox from "./ChatBox/ChatBox";
import { useBetween } from "use-between";
import { User } from "../../Types/Types";
import MiniProfile from "./MiniProfile/MiniProfile";
import { TopContainer } from "./MiniProfile/MiniProfileElements";

const ChatState = (): {
	channel: Channel;
	setChannel: React.Dispatch<React.SetStateAction<Channel>>;
} => {
	const [channel, setChannel] = useState<Channel>(undefined);
	return { channel, setChannel };
};

export const SharedChatState = (): {
	channel: Channel;
	setChannel: React.Dispatch<React.SetStateAction<Channel>>;
} => useBetween(ChatState);

export const outputChatName = (
	channel: Channel,
	user: User,
	data: string,
): string => {
	let ret: string;
	ret = channel.name.replace(user.userName + ",", "");
	ret = ret.replace(", " + user.userName, "");
	return ret;
};

const SideBar = (): JSX.Element => {
	const [view, setView] = useState(0);

	return (
		<SideBarContainer>
			<MiniProfile />
			<Hr />
			<TopContainer>
				<Button
					onClick={() => {
						setView(0);
					}}
				>
					Users
				</Button>
				<Button
					onClick={() => {
						setView(1);
					}}
				>
					Friends
				</Button>
				<Button
					onClick={() => {
						setView(2);
					}}
				>
					Channels
				</Button>
			</TopContainer>
			<SideViewWrapper>
				{view == 0 ? <UserView /> : ""}
				{view == 1 ? <FriendsView /> : ""}
				{view == 2 ? <ChannelsView /> : ""}
				<ChatBox />
			</SideViewWrapper>
		</SideBarContainer>
	);
};

export default SideBar;
