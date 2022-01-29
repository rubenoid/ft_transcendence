import React, { useEffect, useState } from "react";
import { Button } from "../Utils/Buttons/Button/Button";
import { fetchData, postData } from "../../API/API";
import { SettingsContainer } from "./SettingsElements";
import { Label } from "../ConnectionForm/ConnectionFormElements";
import { Img, ImgContainer } from "../Profile/ProfileElements";
import { Link } from "react-router-dom";
import { Item } from "../Utils/List/List";
import { Header, Text } from "../Utils/Text/Text";
import { TextInput } from "../Utils/TextInput/TextInput";
import { User, detailedUser } from "../../Types/Types";
import SettingsTable from "./SettingsTable";
import SettingsTwoFA from "./SettingsTwoFA";
import { LinkButton } from "../Utils/Buttons/Button/LinkButton";

interface toSend {
	endpoint: string;
	data: object;
}

export class formData {
	image = "";
	friendsToAdd: User[] = [];
	blockedToAdd: User[] = [];
	userNameValid = false;
	file: File = undefined;
}

const SettingsForm = (): JSX.Element => {
	const [user, setUser] = useState<detailedUser>(undefined);
	const [toInput, setToInput] = useState(new formData());
	const [newPicutre, setNewPicture] = useState(new Date().getTime());

	const [endpoints, setEndpoints] = useState<string[]>([]);
	const [removingEndpoints, setremovingEndpoints] = useState<toSend[]>([]);
	const [twoFAvalid, setTwoFAvalid] = useState<boolean>(true);

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
		form.append("user", JSON.stringify(user));
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
	};

	function getUsersforUsername(name: string): void {
		const endpoint = `/user/getByUserName/${name}`;
		setUser({ ...user, userName: name });
		if (name.length == 0) return;
		fetchData(endpoint)
			.then((usr: User) => {
				if (usr) setToInput({ ...toInput, userNameValid: true });
				else setToInput({ ...toInput, userNameValid: false });
			})
			.catch(() => {
				setToInput({ ...toInput, userNameValid: false });
			});
	}

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
				<Header>Settings</Header>
				<Text fontSize="20px">Username</Text>
				<TextInput
					type="text"
					value={user.userName}
					onChange={(e) => {
						getUsersforUsername(e.target.value);
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
						value={user.firstName}
						onChange={(e) => {
							setUser({ ...user, firstName: e.target.value });
						}}
					/>
				</Item>
				<Item>
					<Text fontSize="20px">Lastname</Text>
					<TextInput
						type="text"
						value={user.lastName}
						onChange={(e) => {
							setUser({ ...user, lastName: e.target.value });
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
				<SettingsTable
					users={user.blockedUsers}
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
				<SettingsTwoFA
					setEndpoints={setEndpoints}
					user={user}
					setTwoFAvalid={setTwoFAvalid}
				></SettingsTwoFA>
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
				<LinkButton to={-1}>
					<Text>Back</Text>
				</LinkButton>
			</>
		);
	};
	return (
		<SettingsContainer>{user ? settingsData() : "loading"}</SettingsContainer>
	);
};

export default SettingsForm;
