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

// interface newQrData {
// 	qrcode: string;
// 	secret: string;
// }

export class formData {
	image = "";
	isChecked = false;
	// qrcode: newQrData = undefined;
	inputtedTwoFA = "";
	// twoFAvalid = true;
	initial2FAEnabled = false;
	friendsToAdd: User[] = [];
	blockedToAdd: User[] = [];
	userNameValid = false;
	file: File = undefined;
}

const SettingsForm = (): JSX.Element => {
	const [user, setUser] = useState<detailedUser>(undefined);
	// const { user, setUser } = SharedUserState();
	const [toInput, setToInput] = useState(new formData());
	const [newPicutre, setNewPicture] = useState(new Date().getTime());

	const [endpoints, setEndpoints] = useState([]);
	const[twoFAvalid, setTwoFAvalid] = useState<boolean>(true);

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
		getUser().then((res) => {
			if (res == true)
				setToInput({ ...toInput, isChecked: true, initial2FAEnabled: true });
			else
				setToInput({ ...toInput, isChecked: false, initial2FAEnabled: false });
			// console.log("toInput.initial2FAEnabled", toInput.initial2FAEnabled);
		});
	}, []);

	const uploadDataForm = async (
		e: React.FormEvent<HTMLButtonElement>,
	): Promise<void> => {
		e.preventDefault();
		console.log("endpoints", endpoints);
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
		console.log("getting usr again");
		const res = await getUser();
		setEndpoints([]);
		setToInput((prevstate) => {
			const toReplace = new formData();
			toReplace.isChecked = res;
			toReplace.initial2FAEnabled = res;
			toReplace.friendsToAdd = [];
			toReplace.blockedToAdd = [];
			console.log("toreplace: ", toReplace);
			console.log("toInput.initial2FAEnabled", toInput.initial2FAEnabled);
			return toReplace;
		});
		setNewPicture(new Date().getTime());
	};

	/* username valid */
	const handleUserName = (e: string): void => {
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

	// /* two FA change */
	// const twoFAChange = (): void => {
	// 	if (toInput.initial2FAEnabled) {
	// 		setToInput({ ...toInput, twoFAvalid: toInput.isChecked == true });
	// 	} else {
	// 		setToInput({ ...toInput, twoFAvalid: toInput.isChecked == false });
	// 	}
	// 	if (toInput.isChecked && !toInput.initial2FAEnabled) {
	// 		fetchData("auth/getQrRetSecret").then((data: newQrData) => {
	// 			setToInput({ ...toInput, qrcode: data });
	// 		});
	// 	}
	// };

	// useEffect(() => {
	// 	async function inputAccessCode(): Promise<void> {
	// 		if (
	// 			toInput.inputtedTwoFA == undefined ||
	// 			toInput.inputtedTwoFA.length != 6
	// 		)
	// 			return;
	// 		console.log(
	// 			"inputAccessCode:",
	// 			toInput.inputtedTwoFA,
	// 			toInput.inputtedTwoFA.length,
	// 		);
	// 		if (toInput.initial2FAEnabled == true) {
	// 			const validated: boolean = await postData(`/auth/inputAccessCode`, {
	// 				usertoken: toInput.inputtedTwoFA,
	// 			});
	// 			if (validated) {
	// 				endpoints.push(`user/removeTwoFA`);
	// 				setToInput({ ...toInput, twoFAvalid: false });
	// 			} else {
	// 				setToInput({ ...toInput, twoFAvalid: false });
	// 			}
	// 		} else {
	// 			const validated: boolean = await postData(`/auth/testQrCode`, {
	// 				usertoken: toInput.inputtedTwoFA,
	// 				secret: toInput.qrcode.secret,
	// 			});
	// 			if (validated) {
	// 				endpoints.push(`/auth/saveSecret/${toInput.qrcode.secret}`);
	// 				setToInput({ ...toInput, twoFAvalid: true });
	// 			} else {
	// 				setToInput({ ...toInput, twoFAvalid: false });
	// 			}
	// 		}
	// 	}
	// 	inputAccessCode();
	// }, [toInput.inputtedTwoFA]);

	/* upload avatar */
	const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>): void => {
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
						handleUserName(e.target.value);
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
					onChange={handleFileUpload}
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
