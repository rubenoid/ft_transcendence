import React, { useState, useEffect } from "react";
import { WidgetContainer } from "../Utils/Containers/Containers";
import { ImgContainer, Img, TopContainer } from "./ProfileElements";
import { fetchData } from "../../API/API";
import { User } from "../../Types/Types";
import { Button } from "../Utils/Buttons/Button/Button";
import { useNavigate, Link } from "react-router-dom";
import { SharedHeroSection } from "../HeroSection/HeroSection";
import { RoundButton } from "../Utils/Buttons/Round/RoundButton";
import { Text } from "../Utils/Text/Text";
import { useSelector } from 'react-redux';
import { RootState } from "../..";

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

const Profile = (): JSX.Element => {
	const navigate = useNavigate();
	const [user, setUser] = useState<User>(undefined);

	const { isConnected, setIsConnected } = SharedHeroSection();
	useEffect(() => {
		async function getUser(): Promise<User> {
			const user: User = await fetchData("/user/me");
			setUser(user);
			return user;
		}
		getUser();
	}, []);

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
				<TopContainer>
					<ImgContainer>
						<Img
							src={"http://localhost:5000/" + user.avatar}
							alt="profileImg"
						/>
					</ImgContainer>

					<RoundButton onClick={logout}>
						<Text fontSize="25px">🛫</Text>
					</RoundButton>
				</TopContainer>
				<TopContainer>
					<Text>{user.userName}</Text>
					<Text>{user.firstName}</Text>
					<Text>{user.lastName}</Text>
				</TopContainer>
				<TopContainer>
					<Button>
						<Text>
							<Link to={`/profile/${user.id}`}>Profile</Link>
						</Text>
					</Button>
					<Button>
						<Text>
							<Link to="/settings">settings</Link>
						</Text>
					</Button>
					<Button>
						<Text>
							<Link to="/game">Game</Link>
						</Text>
					</Button>
				</TopContainer>
			</>
		);
	};

	const getUser = () => {
		const usr = useSelector((state: RootState) => state.value);
	};

	return <WidgetContainer>{user ? userInfo() : "loading"}</WidgetContainer>;
};

export default Profile;
