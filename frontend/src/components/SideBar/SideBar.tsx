import React, { useState } from "react";
import { SideBarContainer, SideViewWrapper } from "./SideBarElements";
import { Button } from "../Utils/Buttons/Button/Button";
import FriendsView from "./FriendsView/FriendsView";
import ChannelsView from "./ChannelsView/ChannelsView";
import { Channel } from "../../Types/Types";
import ChatBox from "./ChatBox/ChatBox";
import { useBetween } from "use-between";

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

const SideBar = (): JSX.Element => {
	const [isFriendsView, setFriendsView] = useState(true);

	return (
		<SideBarContainer>
			<Button
				onClick={() => {
					setFriendsView(true);
				}}
			>
				Friends
			</Button>
			<Button
				onClick={() => {
					setFriendsView(false);
				}}
			>
				Channels
			</Button>
			<SideViewWrapper>
				{isFriendsView ? <FriendsView /> : <ChannelsView />}
				<ChatBox />
			</SideViewWrapper>
		</SideBarContainer>
	);
};

export default SideBar;
