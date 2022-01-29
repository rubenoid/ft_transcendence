import React from "react";
import { DashBoardContainer, MainContentWrapper } from "./DashBoardElements";
import Users from "../Users/Users";
import Pong from "../Pong/Pong";
import AddFriend from "../AddFriend/AddFriend";
import Profile from "../Profile/Profile";
import { Route, Routes } from "react-router-dom";
import SettingsForm from "../Settings/Settings";
import ProfileExtended from "../ProfileExtended/ProfileExtended";
import ChatSettings from "../ChatSettings/ChatSettings";
import SideBar from "../SideBar/SideBar";

export const DashBoard = (): JSX.Element => {
	return (
		<DashBoardContainer>
			<MainContentWrapper>
				<Routes>
					<Route path="/" element={<p>Welcome!</p>} />
					<Route path="chat/:chatId" element={<ChatSettings />} />
					<Route path="profile/:profileId" element={<ProfileExtended />} />
					<Route path="game/:gameId" element={<Pong />} />
					<Route path="settings" element={<SettingsForm />} />
					<Route path="game" element={<Pong />} />
				</Routes>
			</MainContentWrapper>
			<SideBar />
		</DashBoardContainer>
	);
};

export default DashBoard;
