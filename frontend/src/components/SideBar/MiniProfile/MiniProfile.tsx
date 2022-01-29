import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useBetween } from "use-between";
import { fetchData } from "../../../API/API";
import { SharedConnectionStatus } from "../../../App/ConnectionStatus";
import { SharedUserState } from "../../../App/UserStatus";
import {
	Img,
	ImgContainer,
	ProfileHeader,
	TopContainer,
} from "../../Profile/ProfileElements";
import ProfileExtended from "../../ProfileExtended/ProfileExtended";
import { LinkButton } from "../../Utils/Buttons/Button/LinkButton";
import { RoundButton } from "../../Utils/Buttons/Round/RoundButton";
import { WidgetContainer } from "../../Utils/Containers/Containers";
import { Text } from "../../Utils/Text/Text";
import { DivSpacing } from "./MiniProfileElements";

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

	async function logout(): Promise<void> {
		const endpoint = "/auth/logout";
		await fetchData(endpoint);
		deleteCookie("AuthToken", undefined, undefined);
		setIsConnected(false);
		navigate("/", { replace: true });
	}

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
						<Text>{"online"}</Text>
					</DivSpacing>
					<DivSpacing text-align="right">
						<RoundButton onClick={logout}>
							<Text fontSize="25px">🛫</Text>
						</RoundButton>
					</DivSpacing>
				</ProfileHeader>
				<TopContainer>
					<LinkButton to={`/profile/${user.id}`}>
						<Text>Profile</Text>
					</LinkButton>
					<LinkButton to="/settings">
						<Text>settings</Text>
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
