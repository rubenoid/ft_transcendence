import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchData } from "../../../API/API";
import { SharedConnectionStatus } from "../../../App/ConnectionStatus";
import { SharedGlobalUser } from "../../../App/GlobalUser";
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
import { Link } from "react-router-dom";
import {
	FindStatus,
	SharedUserStatuses,
	StatusColors,
} from "../../../App/UserStatuses";
import { updateSocketHeaders } from "../../../API/Socket";

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
	const { userStatuses, setUserStatuses } = SharedUserStatuses();
	const { user, setUser } = SharedGlobalUser();
	const { isConnected, setIsConnected } = SharedConnectionStatus();
	const [newPicutre, setNewPicture] = useState(new Date().getTime());
	const navigate = useNavigate();
	const [status, setStatus] = useState<string>("");

	async function logout(): Promise<void> {
		await fetchData("/auth/logout");
		deleteCookie("AuthToken", undefined, undefined);
		updateSocketHeaders(true);
		setIsConnected(false);
		navigate("/", { replace: true });
	}

	useEffect(() => {
		if (user) setStatus(FindStatus(user.id, userStatuses));
	}, [userStatuses]);

	useEffect(() => {
		setNewPicture(new Date().getTime());
	}, [user]);

	const userInfo = (): JSX.Element => {
		return (
			<>
				<ProfileHeader>
					<DivSpacing text-align="-webkit-center">
						<ImgContainer>
							<Link to={"/"}>
								<Img
									src={"http://localhost:5000/" + user.avatar + "?" + newPicutre}
									alt="profileImg"
								/>
							</Link>
						</ImgContainer>
					</DivSpacing>
					<DivSpacing>
						<Text>{user.userName}</Text>
						<Text>{user.firstName}</Text>
						<Text>{user.lastName}</Text>
						<Text fontSize="10" color={StatusColors.get(status)}>
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
