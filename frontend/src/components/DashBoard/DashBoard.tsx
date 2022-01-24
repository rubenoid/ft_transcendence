import React from "react";
import { DashBoardContainer, Box } from "./DashBoardElements";
import Users from "../Users/Users";
import Pong from "../Pong/Pong";
import AddFriend from "../AddFriend/AddFriend";
import Profile from "../Profile/Profile";
import { Route, Routes } from "react-router-dom";
import SettingsForm from "../Settings/Settings";
import ProfileExtended from "../ProfileExtended/ProfileExtended";
import SideBar from "../SideBar/SideBar";
import MyChat from "../MyChat/MyChat";
import { useSelector } from 'react-redux';
import { RootState } from "../..";

export const DashBoard = (): JSX.Element => {
    const usr = useSelector((state: RootState) => state.value);
	return (
		<DashBoardContainer>
			<Box gridArea="info1">
				<Users />
			</Box>
			<Box gridArea="profile">
				<Profile></Profile>
			</Box>
			<Box gridArea="info2">
				<AddFriend />
			</Box>
			<Box gridArea="game">
				<Routes>
					<Route path="/" element={<p>Welcome!</p>} />
					<Route path="profile/:profileId" element={<ProfileExtended />} />
					<Route path="game/:gameId" element={<Pong />} />
					<Route path="settings" element={<SettingsForm />} />
					<Route path="game" element={<Pong />} />
				</Routes>
			</Box>
			<Box gridArea="chat" alignSelf="center">
				<SideBar />
			</Box>
			{usr ?
				<Box gridArea="chatBox" alignSelf="center">
					<MyChat/>
				</Box>
				: ""
			}
		</DashBoardContainer>
	);
};

export default DashBoard;
