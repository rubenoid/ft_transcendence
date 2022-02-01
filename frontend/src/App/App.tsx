import React, { useEffect } from "react";
import { GlobalStyle } from "./App.styles";
import { SharedGlobalUser } from "./GlobalUser";
import { SharedConnectionStatus } from "./ConnectionStatus";
import { Navigate } from "react-router-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { fetchData, updateHttpHeaders } from "../API/API";
import { updateSocketHeaders } from "../API/Socket";
import { User, UserStatus } from "../Types/Types";
import RegistrationForm from "../components/ConnectionForm/RegistrationForm";
import AdminView from "../components/AdminView/AdminView";
import DashBoard from "../components/DashBoard/DashBoard";
import ConnectionForm from "../components/ConnectionForm/ConnectionForm";
import TwoFACheck from "../components/ConnectionForm/twoFACheck";
import socket from "../API/Socket";
import { SharedUserStatuses } from "./UserStatuses";

const App = (): JSX.Element => {
	const { user, setUser } = SharedGlobalUser();
	const { isConnected, setIsConnected } = SharedConnectionStatus();
	const { userStatuses, setUserStatuses } = SharedUserStatuses();

	function updateStatus(data: UserStatus): void {
		console.log(data, userStatuses);
		const found = userStatuses.find((x) => x.id == data.id);
		if (found) {
			console.log("Found and updated a status");
			found.status = data.status;
			setUserStatuses([...userStatuses]);
		} else {
			console.log("Didnt find, still added");
			setUserStatuses([...userStatuses, data]);
		}
	}

	async function loadStatus(): Promise<void> {
		if (userStatuses.length != 0) return;
		const statuses: UserStatus[] = await fetchData("/user/getAllStatus");
		console.log("statuses", statuses);
		setUserStatuses([...statuses]);
	}

	useEffect(() => {
		console.log("EFFECT");
		loadStatus().then(() => {
			socket.on("userUpdate", updateStatus);
		});
		return () => {
			socket.off("userUpdate");
		};
	}, [updateStatus, user]);

	useEffect(() => {
		updateHttpHeaders();
		updateSocketHeaders();
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
