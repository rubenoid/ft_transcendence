import React, { useEffect } from "react";
import { GlobalStyle } from "./App.styles";
import { SharedUserState } from "./UserStatus";
import { SharedConnectionStatus } from "./ConnectionStatus";
import { Navigate } from "react-router-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { fetchData, updateHeaders } from "../API/API";
import { User } from "../Types/Types";
import RegistrationForm from "../components/ConnectionForm/RegistrationForm";
import AdminView from "../components/AdminView/AdminView";
import DashBoard from "../components/DashBoard/DashBoard";
import ConnectionForm from "../components/ConnectionForm/ConnectionForm";
import TwoFACheck from "../components/ConnectionForm/twoFACheck";

const App = (): JSX.Element => {
	const { setUser } = SharedUserState();
	const { isConnected, setIsConnected } = SharedConnectionStatus();

	useEffect(() => {
		updateHeaders();
		fetchData("/user/me")
			.then((user: User) => {
				setUser(user);
				setIsConnected(true);
			})
			.catch((er) => {
				setIsConnected(false);
			});
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
		<>
			<GlobalStyle />
			{isConnected == undefined ? "loading" : router()}
		</>
	);
};

export default App;
