import React from "react";
import {
	DashBoardContainer,
	DashBoardContentWrapper,
} from "./DashBoardElements";
import { Route, Routes } from "react-router-dom";
import SettingsForm from "../Settings/Settings";
import ProfileExtended from "../ProfileExtended/ProfileExtended";
import ChatSettings from "../ChatSettings/ChatSettings";
import SideBar from "../SideBar/SideBar";
import PongView from "../Pong/Pong";

export const DashBoard = (): JSX.Element => {
	return (
		<DashBoardContainer>
			<DashBoardContentWrapper>
				<Routes>
					<Route path="/" element={<p>Welcome!</p>} />
					<Route path="chat/:chatId" element={<ChatSettings />} />
					<Route path="profile/:profileId" element={<ProfileExtended />} />
					<Route path="game/:gameId" element={<PongView />} />
					<Route path="settings" element={<SettingsForm />} />
					<Route path="game" element={<PongView />} />
				</Routes>
			</DashBoardContentWrapper>
			<SideBar />
		</DashBoardContainer>
	);
};

export default DashBoard;
