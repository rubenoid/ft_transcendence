import React, { useState, useEffect, useLayoutEffect } from "react";
import { HeroContainer } from "./HeroSectionElements";
import DashBoard from "../DashBoard/DashBoard";
import ConnectionForm from "../ConnectionForm/ConnectionForm";
import RegistrationForm from "../ConnectionForm/RegistrationForm";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import TwoFACheck from "../ConnectionForm/twoFACheck";
import { fetchData, updateHeaders } from "../../API/API";
import { useNavigate, Navigate } from "react-router-dom";
import { useBetween } from "use-between";
import { User } from "../../Types/Types";
import { SharedUserState } from "../Profile/Profile";
import AdminView from "../AdminView/AdminView";

type UserProps = {
	isConnected: boolean;
};

const ConnectionStatus = (): {
	isConnected: boolean;
	setIsConnected: React.Dispatch<React.SetStateAction<boolean>>;
} => {
	const [isConnected, setIsConnected] = useState<boolean>(undefined);
	return { isConnected, setIsConnected };
};

export const SharedHeroSection = (): {
	isConnected: boolean;
	setIsConnected: React.Dispatch<React.SetStateAction<boolean>>;
} => useBetween(ConnectionStatus);

const HeroSection = (): JSX.Element => {
	const { user, setUser } = SharedUserState();
	const { isConnected, setIsConnected } = SharedHeroSection();
	useEffect(() => {
		async function getUser(): Promise<void> {
			updateHeaders();
			let user: User;
			try {
				user = await fetchData("/user/me");
				setUser(user);
				setIsConnected(true);
			} catch (e) {
				setIsConnected(false);
			}
			console.log(" useEffect isConnected", isConnected, document.cookie);
		}
		console.log("in use effects is connected", isConnected);
		getUser();
	}, [isConnected]);

	const router = (): JSX.Element => {
		return (
			<BrowserRouter>
				<Routes>
					<Route
						path="/*"
						element={isConnected ? <DashBoard /> : <Navigate to="/login" />}
					/>
					<Route
						path="/login"
						element={!isConnected ? <ConnectionForm /> : <Navigate to="/" />}
					/>
					<Route
						path="/register"
						element={
							!isConnected ? <RegistrationForm /> : <Navigate to="/login" />
						}
					/>
					<Route path="/checkTwoFA" element={<TwoFACheck />} />
					<Route
						path="/admin"
						element={isConnected ? <AdminView /> : <Navigate to="/login" />}
					/>
				</Routes>
			</BrowserRouter>
		);
	};
	return (
		<HeroContainer>
			{isConnected == undefined ? "loading" : router()}
		</HeroContainer>
	);
};

export default HeroSection;
