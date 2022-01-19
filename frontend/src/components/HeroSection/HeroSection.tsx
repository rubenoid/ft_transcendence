import React, { useState, useEffect, useLayoutEffect } from "react";
import { HeroContainer } from "./HeroSectionElements";
import DashBoard from "../DashBoard/DashBoard";
import ConnectionForm from "../ConnectionForm/ConnectionForm";
import RegistrationForm from "../ConnectionForm/RegistrationForm";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import TwoFACheck from "../ConnectionForm/twoFACheck";
import { fetchData, User } from "../../API/API";
import { useNavigate, Navigate } from "react-router-dom";

type UserProps = {
	isConnected: boolean;
};

// const Content = (usr: UserProps) => {

//     if (usr.isConnected)
//         return (<DashBoard/>);
//     else
//         return (<ConnectionForm/>);
// }

const HeroSection = (): JSX.Element => {
	const [isConnected, setisConnected] = useState<boolean>(undefined);

	useEffect(() => {
		async function getUser(): Promise<void> {
			const user: User = await fetchData(`/user/me`);
			if (user) {
				setisConnected(true);
			} else {
				setisConnected(false);
			}
			console.log("isConnected", isConnected);
		}
		getUser();
	}, []);

	const router = () => {
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
				</Routes>
			</BrowserRouter>
		);
	};

	return (
		<HeroContainer>
			{isConnected == undefined ? `loading` : router()}
		</HeroContainer>
	);
};
export default HeroSection;
