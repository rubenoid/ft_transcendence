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
	const { isConnected, setIsConnected } = SharedHeroSection();
	useEffect(() => {
		async function getUser(): Promise<void> {
			updateHeaders();
			const user: User = await fetchData("/user/me");
			if (user) {
				setIsConnected(true);
			} else {
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
					{/* <Route path='/reLogin'    element={<ConnectionForm/>}/> */}
					{/* <Route path="/logedin" element={<DashBoard />} /> */}
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
