import React, { useState } from "react";
import { SideBarContainer } from "./SideBarElements";
import { Button } from "../Utils/Buttons/Button/Button";
import FriendsView from "./FriendsView/FriendsView";
import ChannelsView from "./ChannelsView/ChannelsView";
import { Channel } from "../../Types/Types";
import ChatBox from "./ChatBox/ChatBox";

const SideBar = (): JSX.Element => {
	const [isFriendsView, setFriendsView] = useState(true);
	const [selectedUser, setSelectedUser] = useState<Channel>();

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
			{isFriendsView ? <FriendsView setSelectedUser={setSelectedUser} /> : <ChannelsView />}
			{selectedUser ? <ChatBox chatWith={selectedUser} /> : ""}
		</SideBarContainer>
	);
};

export default SideBar;
