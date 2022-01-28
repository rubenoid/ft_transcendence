import React, { useEffect, useState } from "react";
import { Button } from "../Utils/Buttons/Button/Button";
import { fetchData, postData } from "../../API/API";
import { SettingsContainer } from "./SettingsElements";
import { Label } from "../ConnectionForm/ConnectionFormElements";
import { Img, ImgContainer } from "../Profile/ProfileElements";
import { Link } from "react-router-dom";
import { Item } from "../Utils/List/List";
import { Text } from "../Utils/Text/Text";
import { TextInput } from "../Utils/TextInput/TextInput";
import { User } from "../../Types/Types";
import SettingsTable from "./SettingsTable";
import SettingsTwoFA from "./SettingsTwoFA";
import { SharedUserState } from "../../App/UserStatus";

interface detailedUser extends User {
	twoFactorSecret: string;
	blockedUsers: User[];
}


export class formData {
	image = "";
	isChecked = false;
	inputtedTwoFA = "";
	initial2FAEnabled = false;
	friendsToAdd: User[] = [];
	blockedToAdd: User[] = [];
	userNameValid = false;
	file: File = undefined;
}

const SettingsForm = (): JSX.Element => {
	const [user, setUser] = useState<detailedUser>(undefined);
	const [toInput, setToInput] = useState(new formData());
	const [newPicutre, setNewPicture] = useState(new Date().getTime());

	const [endpoints, setEndpoints] = useState([]);
	const[twoFAvalid, setTwoFAvalid] = useState<boolean>(true);
	const[changingData, setChangingData] = useState<boolean>(true);

	async function getUser(): Promise<boolean> {
		const user: detailedUser = await fetchData("/user/menFriendsnBlocked");
		setUser(user);
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
			if (typeof endpoint == "string") await fetchData(endpoint);
			else await fetchData(endpoint.endpoint);
		}
		for (const user of toInput.friendsToAdd) {
			await fetchData(`/friends/add/${user.id}`);
		}
		for (const user of toInput.blockedToAdd) {
			await fetchData(`/blocked/add/${user.id}`);
		}
		const form = new FormData();
		form.append("user", JSON.stringify(user));
		form.append("file", toInput.file);
		await postData("/user/updateForm", form, {
			"Content-Type": "multipart/form-data",
		});
		const res = await getUser();
		setChangingData(!changingData);
		setEndpoints([]);
		setToInput((prevstate) => {
			const toReplace = new formData();
			toReplace.isChecked = res;
			toReplace.initial2FAEnabled = res;
			toReplace.friendsToAdd = [];
			toReplace.blockedToAdd = [];
			return toReplace;
		});
		setNewPicture(new Date().getTime());
	};

	const CheckIfUserNameValid = (e: string): void => {
		async function getUsersforUsername(): Promise<void> {
			const endpoint = `/user/getByUserName/${e}`;
			const UserFromUserName: User = await fetchData(endpoint);
			if (!UserFromUserName) {
				setToInput({ ...toInput, userNameValid: true });
				setUser({ ...user, userName: e });
			} else {
				setToInput({ ...toInput, userNameValid: false });
			}
		}
		getUsersforUsername();
	};

	const uploadAvatar = (e: React.ChangeEvent<HTMLInputElement>): void => {
		console.log("endpoints", endpoints);
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
				<h1>Settings</h1>
				<Text fontSize="20px">Username</Text>
				<TextInput
					type="text"
					placeholder={user.userName}
					onChange={(e) => {
						CheckIfUserNameValid(e.target.value);
					}}
				/>
				{toInput.userNameValid ? (
					<Text>username available and unique</Text>
				) : (
					<Text>username already in use</Text>
				)}
				<Item>
					<Text fontSize="20px">FirstName</Text>
					<TextInput
						type="text"
						placeholder={user.firstName}
						onChange={(e) => {
							user.firstName = e.target.value;
						}}
					/>
				</Item>
				<Item>
					<Text fontSize="20px">Lastname</Text>
					<TextInput
						type="text"
						placeholder={user.lastName}
						onChange={(e) => {
							user.lastName = e.target.value;
						}}
					/>
				</Item>
				<Label htmlFor="upload-button">
					{toInput.image.length == 0 ? (
						<div>
							<Text color="black">Click to change your avatar</Text>
							<ImgContainer>
								<Img
									src={
										"http://localhost:5000/" + user.avatar + "?" + newPicutre
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
					users={user.friends}
					endpoint={"/friends/remove/"}
					setEndpoints={setEndpoints}
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
				<SettingsTable
					users={user.blockedUsers}
					endpoint={"/blocked/remove/"}
					setEndpoints={setEndpoints}
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
				<SettingsTwoFA
					// initial2FAEnabled={toInput.initial2FAEnabled}
					// twoFAvalid={twoFAvalid}
					changingData={changingData}
					endpoints={endpoints}
					user={user}
					onInputEvent={(e: boolean) =>
						setTwoFAvalid(e)
					}
				></SettingsTwoFA>
				{/* {toInput.isChecked && !toInput.initial2FAEnabled ? (
					<Item>
						{toInput.qrcode !== undefined &&
						toInput.qrcode.qrcode !== undefined ? (
							<img src={toInput.qrcode.qrcode} alt="" />
						) : (
							"loading"
						)}
						<Label>
							<Text fontSize="20px">Input2FA code pls</Text>
						</Label>
						<TextInput
							type="text"
							onChange={(e) => {
								setToInput({ ...toInput, inputtedTwoFA: e.target.value });
							}}
						/>
					</Item>
				) : !toInput.isChecked && toInput.initial2FAEnabled ? (
					<Item>
						<Label>
							<Text fontSize="20px">Your 2fa code please</Text>
						</Label>
						<TextInput
							type="text"
							onChange={(e) => {
								setToInput({ ...toInput, inputtedTwoFA: e.target.value });
							}}
						/>
					</Item>
				) : (
					""
				)} */}
				{twoFAvalid === false ? (
					<>
						<Button disabled>
							<Text fontSize="15px">Save changes</Text>
						</Button>
					</>
				) : (
					<>
						<Button onClick={uploadDataForm}>
							<Text fontSize="15px">Save changes</Text>
						</Button>
					</>
				)}
				<Button>
					<Text fontSize="15px">
						<Link to="/">Back</Link>
					</Text>
				</Button>
			</>
		);
	};
	return (
		<SettingsContainer>{user ? settingsData() : "loading"}</SettingsContainer>
	);
};

export default SettingsForm;
