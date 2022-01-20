import React, { useState } from "react";
import { SideBarContainer } from "./SideBarElements";
import { Button } from "../Utils/Buttons/Button/Button";
import FriendsView from "./FriendsView/FriendsView";
import ChannelsView from "./ChannelsView/ChannelsView";

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
			{isFriendsView ? <FriendsView /> : <ChannelsView />}
		</SideBarContainer>
	);
};

export default SideBar;
