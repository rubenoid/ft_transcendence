import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchData } from "../../../API/API";
import { SharedConnectionStatus } from "../../../App/ConnectionStatus";
import { SharedUserState } from "../../../App/UserStatus";
import {
	Img,
	ImgContainer,
	ProfileHeader,
	TopContainer,
} from "./MiniProfileElements";
import { LinkButton } from "../../Utils/Buttons/Button/LinkButton";
import { RoundButton } from "../../Utils/Buttons/Round/RoundButton";
import { Text } from "../../Utils/Text/Text";
import { DivSpacing } from "./MiniProfileElements";
import { IconContainer } from "../../Utils/IconContainer";
import { AiOutlineLogout as LogoutIcon } from "react-icons/ai";

function deleteCookie(
	name: string,
	path: string | undefined,
	domain: string | undefined,
): void {
	if (getCookie(name)) {
		document.cookie =
			name +
			"=" +
			(path ? ";path=" + path : "") +
			(domain ? ";domain=" + domain : "") +
			";expires=Thu, 01 Jan 1970 00:00:01 GMT";
	}
}

function getCookie(name: string): boolean {
	return document.cookie.split(";").some((c) => {
		return c.trim().startsWith(name + "=");
	});
}

const MiniProfile = (): JSX.Element => {
	const navigate = useNavigate();

	const { user, setUser } = SharedUserState();
	const { isConnected, setIsConnected } = SharedConnectionStatus();
	const [status, setStatus] = useState<string>("");

	async function logout(): Promise<void> {
		const endpoint = "/auth/logout";
		await fetchData(endpoint);
		deleteCookie("AuthToken", undefined, undefined);
		setIsConnected(false);
		navigate("/", { replace: true });
	}

	useEffect(() => {
		async function getMyStatus(): Promise<void> {
			const foundStatus: string = await fetchData(
				`/user/userStatus/${user.id}`,
			);
			setStatus(foundStatus);
		}
		getMyStatus();
	}, []);

	const userInfo = (): JSX.Element => {
		return (
			<>
				<ProfileHeader>
					<DivSpacing text-align="-webkit-center">
						<ImgContainer>
							<Img
								src={"http://localhost:5000/" + user.avatar}
								alt="profileImg"
							/>
						</ImgContainer>
					</DivSpacing>
					<DivSpacing>
						<Text>{user.userName}</Text>
						<Text>{user.firstName}</Text>
						<Text>{user.lastName}</Text>
						<Text
							fontSize="10"
							color={status === "Online" ? "#04aa6d" : "#ff3a3a"}
						>
							{status ? status : "Offline"}
						</Text>
					</DivSpacing>
					<DivSpacing text-align="right">
						<RoundButton onClick={logout}>
							<IconContainer color="#ff3a3a" hoverColor="#cc3a3a">
								<LogoutIcon size={30} />
							</IconContainer>
						</RoundButton>
					</DivSpacing>
				</ProfileHeader>
				<TopContainer>
					<LinkButton to={`/profile/${user.id}`}>
						<Text>Profile</Text>
					</LinkButton>
					<LinkButton to="/settings">
						<Text>Settings</Text>
					</LinkButton>
					<LinkButton to="/game">
						<Text>Game</Text>
					</LinkButton>
				</TopContainer>
			</>
		);
	};
	return <div>{user ? userInfo() : "loading"}</div>;
};

export default MiniProfile;
