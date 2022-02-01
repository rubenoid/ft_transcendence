import React, { useEffect, useState } from "react";
import { Button } from "../Utils/Buttons/Button/Button";
import { fetchData, postData } from "../../API/API";
import {
	MainContentWrapper,
	HeaderWrapper,
	FooterWrapper,
	MainViewContainer,
} from "../Utils/Containers/Containers";
import { Label } from "../Utils/Label/Label";
import { Img, ImgContainer } from "../SideBar/MiniProfile/MiniProfileElements";
import { Item } from "../Utils/List/List";
import { Header, Text } from "../Utils/Text/Text";
import { TextInput } from "../Utils/TextInput/TextInput";
import { User, ToSend } from "../../Types/Types";
import SettingsTable from "./SettingsTable";
import SettingsTwoFA from "./SettingsTwoFA";
import { LinkButton } from "../Utils/Buttons/Button/LinkButton";
import { SharedGlobalUser } from "../../App/GlobalUser";
import { SharedUserFriends } from "../../App/UserFriends";

export class formData {
	image = "";
	friendsToAdd: User[] = [];
	blockedToAdd: User[] = [];
	userNameValid = true;
	file: File = undefined;
}

const SettingsForm = (): JSX.Element => {
	const [toInput, setToInput] = useState(new formData());
	const [newPicutre, setNewPicture] = useState(new Date().getTime());
	const [endpoints, setEndpoints] = useState<string[]>([]);
	const [removingEndpoints, setremovingEndpoints] = useState<ToSend[]>([]);
	const [twoFAvalid, setTwoFAvalid] = useState<boolean>(true);
	const [userSettings, setUserSettings] = useState<User>(undefined);
	const { user, setUser } = SharedGlobalUser();
	const { friends, setFriends } = SharedUserFriends();

	async function getUser(): Promise<boolean> {
		const user: User = await fetchData("/user/menFriendsnBlocked");
		setUserSettings(user);
		if (user.twoFactorSecret.length == 0) {
			return false;
		} else {
			return true;
		}
	}

	useEffect(() => {
		getUser();
	}, []);

	const uploadDataForm = async (
		e: React.FormEvent<HTMLButtonElement>,
	): Promise<void> => {
		e.preventDefault();
		for (const endpoint of endpoints) {
			await fetchData(endpoint);
		}
		for (const removingEndpoint of removingEndpoints) {
			await fetchData(removingEndpoint.endpoint);
		}
		for (const user of toInput.friendsToAdd) {
			await fetchData(`/friends/add/${user.id}`);
		}
		for (const user of toInput.blockedToAdd) {
			await fetchData(`/blocked/add/${user.id}`);
		}
		const form = new FormData();
		form.append("user", JSON.stringify(userSettings));
		form.append("file", toInput.file);
		await postData("/user/updateForm", form, {
			"Content-Type": "multipart/form-data",
		});
		const res = await getUser();
		setEndpoints([]);
		setToInput((prevstate) => {
			const toReplace = new formData();
			toReplace.friendsToAdd = [];
			toReplace.blockedToAdd = [];
			return toReplace;
		});
		setNewPicture(new Date().getTime());
		setUser(await fetchData("/user/me"));
		setFriends(await fetchData("/friends/me"));
	};

	function getUsersforUsername(name: string): void {
		const endpoint = `/user/getByUserName/${name}`;
		setUserSettings({ ...userSettings, userName: name });
		if (name.length == 0) setToInput({ ...toInput, userNameValid: false });
		fetchData(endpoint)
			.then((usr: User) => {
				console.log(name, "User: ", usr);
				if (usr && usr.id != userSettings.id)
					setToInput({ ...toInput, userNameValid: false });
				else setToInput({ ...toInput, userNameValid: true });
			})
			.catch(() => {
				setToInput({ ...toInput, userNameValid: false });
			});
	}

	const uploadAvatar = (e: React.ChangeEvent<HTMLInputElement>): void => {
		if (e.target.files && e.target.files.length) {
			setToInput({
				...toInput,
				image: URL.createObjectURL(e.target.files[0]),
				file: e.target.files[0],
			});
		}
	};

	const settingsData = (): JSX.Element => {
		return (
			<>
				<HeaderWrapper>
					<Header>Settings</Header>
				</HeaderWrapper>
				<MainContentWrapper>
					<Text fontSize="20px">Username</Text>
					<TextInput
						type="text"
						value={userSettings.userName}
						onChange={(e) => {
							getUsersforUsername(e.target.value);
						}}
					/>
					{toInput.userNameValid == true ? (
						<Text>username available and unique</Text>
					) : (
						<Text>username already in use</Text>
					)}
					<Item>
						<Text fontSize="20px">FirstName</Text>
						<TextInput
							type="text"
							value={userSettings.firstName}
							onChange={(e) => {
								setUserSettings({ ...userSettings, firstName: e.target.value });
							}}
						/>
					</Item>
					<Item>
						<Text fontSize="20px">Lastname</Text>
						<TextInput
							type="text"
							value={userSettings.lastName}
							onChange={(e) => {
								setUserSettings({ ...userSettings, lastName: e.target.value });
							}}
						/>
					</Item>
					<Label htmlFor="upload-button">
						{toInput.image.length == 0 ? (
							<div>
								<Text>Click to change your avatar</Text>
								<ImgContainer>
									<Img
										src={
											"http://localhost:5000/" +
											userSettings.avatar +
											"?" +
											newPicutre
										}
										alt="profileImg"
										width="300"
										height="300"
									/>
								</ImgContainer>
							</div>
						) : (
							<ImgContainer>
								<Img src={toInput.image} alt="dummy" width="300" height="300" />
							</ImgContainer>
						)}
					</Label>
					<input
						type="file"
						id="upload-button"
						style={{ display: "none" }}
						onChange={uploadAvatar}
					/>
					<SettingsTable
						users={userSettings.friends}
						endpoint={"/friends/remove/"}
						setEndpoints={setremovingEndpoints}
						stagedList={toInput.friendsToAdd}
						title={"Friends"}
						onInputEvent={(e: User) =>
							setToInput({
								...toInput,
								friendsToAdd: [...toInput.friendsToAdd, e],
							})
						}
					>
						<Text>Find Users to add as a friend</Text>
					</SettingsTable>
					<br />
					<SettingsTable
						users={userSettings.blockedUsers}
						endpoint={"/blocked/remove/"}
						setEndpoints={setremovingEndpoints}
						stagedList={toInput.blockedToAdd}
						title={"Blocked"}
						onInputEvent={(e: User) =>
							setToInput({
								...toInput,
								blockedToAdd: [...toInput.blockedToAdd, e],
							})
						}
					>
						<Text>Find Users to block</Text>
					</SettingsTable>
					<br />
					<SettingsTwoFA
						setEndpoints={setEndpoints}
						user={userSettings}
						setTwoFAvalid={setTwoFAvalid}
					></SettingsTwoFA>
				</MainContentWrapper>
				<FooterWrapper>
					{twoFAvalid === false ? (
						<>
							<Button disabled>
								<Text>Save changes</Text>
							</Button>
						</>
					) : (
						<>
							<Button onClick={uploadDataForm}>
								<Text>Save changes</Text>
							</Button>
						</>
					)}
					<LinkButton to={-1}>
						<Text>Back</Text>
					</LinkButton>
				</FooterWrapper>
			</>
		);
	};
	return (
		<MainViewContainer>
			{userSettings ? settingsData() : "loading"}
		</MainViewContainer>
	);
};

export default SettingsForm;
