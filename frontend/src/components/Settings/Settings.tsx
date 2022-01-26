import React, { useEffect, useState } from "react";
import {
	TableRow,
	TableCell,
	TableHeader,
	TableHeaderCell,
	Table,
} from "../Utils/Table/Table";
import { Button } from "../Utils/Buttons/Button/Button";
import { fetchData, postData } from "../../API/API";
import { SettingsContainer } from "./SettingsElements";
import { Label } from "../ConnectionForm/ConnectionFormElements";
import { Img, ImgContainer } from "../Profile/ProfileElements";
import { Link, useNavigate } from "react-router-dom";
import { Item } from "../Utils/List/List";
import { Text } from "../Utils/Text/Text";
import { TextInput } from "../Utils/TextInput/TextInput";
import { User } from "../../Types/Types";
import AddUserInput from "../AddUserInput/AddUserInput";
import EndpointButton from "../EndpointButton/EndpointButton";

interface detailedUser extends User {
	twoFactorSecret: string;
	blockedUsers: User[];
}

interface newQrData {
	qrcode: string;
	secret: string;
}



const SettingsForm = (): JSX.Element => {
	const navigate = useNavigate();
	const [user, setUser] = useState<detailedUser>(undefined);

	const [image, setImage] = useState<string>("");
	const [file, setfile] = useState(undefined);

	const [isChecked, setIsChecked] = useState(undefined);
	const [qrcode, setqrcode] = useState<newQrData>(undefined);
	const [inputtedTwoFA, setinputtedTwoFA] = useState<string>(undefined);
	const [twoFAvalid, settwoFAvalid] = useState<boolean>(true);
	const [initial2FAEnabled, setinitial2FAEnabled] =
		useState<boolean>(undefined);

	const [UserNameValid, setUserNameValid] = useState<boolean>(undefined);
	const [friendsToAdd, setFriendsToAdd] = useState<User[]>([]);
	const [blockedToAdd, setBlockedToAdd] = useState<User[]>([]);
	const [endpoints, setEndpoints] = useState([]);

	async function getUser(): Promise<User> {
		const user: detailedUser = await fetchData("/user/menFriendsnBlocked");
		console.log("user got", user);
		if (user.twoFactorSecret.length == 0) {
			console.log("TWO FA DISABLED");
			setIsChecked(false);
			setinitial2FAEnabled(false);
		} else {
			console.log("TWO FA ENABLED");
			setIsChecked(true);
			setinitial2FAEnabled(true);
		}
		setUser(user);
		return user;
	}

	useEffect(() => {
		getUser();
	}, []);

	const uploadDataForm = async (
		e: React.FormEvent<HTMLButtonElement>,
	): Promise<void> => {
		e.preventDefault();
		console.log(endpoints);
		for (const endpoint of endpoints) {
			if (typeof endpoint == "string") await fetchData(endpoint);
			else await fetchData(endpoint.endpoint);
		}

		for (const user of friendsToAdd) {
			await fetchData(`/friends/add/${user.id}`);
		}

		for (const user of blockedToAdd) {
			await fetchData(`/blocked/add/${user.id}`);
		}

		const formData = new FormData();
		formData.append("user", JSON.stringify(user));
		formData.append("file", file);
		await postData("/user/updateForm", formData, {
			"Content-Type": "multipart/form-data",
		});
		// setUser(undefined);

		// setImage("");
		// setfile(undefined);
	
		// const [isChecked, setIsChecked] = useState(undefined);
		// const [qrcode, setqrcode] = useState<newQrData>(undefined);
		// const [inputtedTwoFA, setinputtedTwoFA] = useState<string>(undefined);
		// const [twoFAvalid, settwoFAvalid] = useState<boolean>(true);
		// const [initial2FAEnabled, setinitial2FAEnabled] =
		// 	useState<boolean>(undefined);
	
		// const [UserNameValid, setUserNameValid] = useState<boolean>(undefined);
		// const [friendsToAdd, setFriendsToAdd] = useState<User[]>([]);
		// const [blockedToAdd, setBlockedToAdd] = useState<User[]>([]);
		// setBlockedToAdd([])
		// const [endpoints, setEndpoints] = useState([]);
		getUser();
	};

	/* username valid */
	const handleUserName = (e: string): void => {
		async function getUsersforUsername(): Promise<void> {
			const endpoint = `/user/getByUserName/${e}`;
			const UserFromUserName: User = await fetchData(endpoint);
			setUserNameValid(false);
			console.log("UserNameValid", UserNameValid);
			if (!UserFromUserName) {
				setUserNameValid(true);
				setUser({ ...user, userName: e });
			}
		}
		getUsersforUsername();
	};

	/* two FA change */
	const twoFAChange = (): void => {
		setIsChecked(!isChecked);
		console.log("CHECKED?", isChecked);
		if (initial2FAEnabled) settwoFAvalid(isChecked == true);
		else settwoFAvalid(isChecked == false);

		if (isChecked && !initial2FAEnabled) {
			fetchData("auth/getQrRetSecret").then((data: newQrData) => {
				setqrcode(data);
			});
		}
	};

	useEffect(() => {
		async function inputAccessCode(): Promise<void> {
			if (inputtedTwoFA == undefined || inputtedTwoFA.length != 6) return;
			console.log("inputAccessCode:", inputtedTwoFA, inputtedTwoFA.length);
			if (initial2FAEnabled == true) {
				const validated: boolean = await postData(`/auth/inputAccessCode`, {
					usertoken: inputtedTwoFA,
				});
				if (validated) {
					endpoints.push(`user/removeTwoFA`);
					settwoFAvalid(true);
				} else {
					settwoFAvalid(false);
				}
			} else {
				const validated: boolean = await postData(`/auth/testQrCode`, {
					usertoken: inputtedTwoFA,
					secret: qrcode.secret,
				});
				if (validated) {
					const endpoint = `/auth/saveSecret/${qrcode.secret}`;
					endpoints.push(endpoint);
					settwoFAvalid(true);
				} else {
					settwoFAvalid(false);
				}
			}
		}
		inputAccessCode();
	}, [inputtedTwoFA]);

	const displayToAdd = (users: User[], name: string): JSX.Element => {
		return (
			<div>
				<Text>{name}</Text>
				{users.length
					? users.map((user: User, key: number) => {
							return (
								<div key={key}>
									<Text>{user.userName}</Text>
								</div>
							);
					  })
					: ""}
			</div>
		);
	};

	/* upload avatar */
	const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>): void => {
		if (e.target.files && e.target.files.length) {
			setImage(URL.createObjectURL(e.target.files[0]));
			setfile(e.target.files[0]);
		}
	};

	const settingsData = (): JSX.Element => {
		console.log("user", user);
		console.log("user.friends", user.friends);
		const listfriends = user.friends.map((friend: User, key: number) => {
			return (
				<TableRow key={key}>
					<TableCell>
						<Text fontSize="10">{friend.userName}</Text>
					</TableCell>
					<TableCell>
						<Text fontSize="10">{friend.firstName}</Text>
					</TableCell>
					<TableCell>
						<Text fontSize="10">{friend.lastName}</Text>
					</TableCell>
					<TableCell>
						<EndpointButton
							useSmall={true}
							endpointRef={setEndpoints}
							toSet={{ endpoint: `/friends/remove/${friend.id}`, data: {} }}
						>
							<Text>Remove</Text>
						</EndpointButton>
					</TableCell>
				</TableRow>
			);
		});

		const listblockedusers = user.blockedUsers.map(
			(blocked: User, key: number) => {
				return (
					<TableRow key={key}>
						<TableCell>
							<Text fontSize="10">{blocked.userName}</Text>
						</TableCell>
						<TableCell>
							<Text fontSize="10">{blocked.firstName}</Text>
						</TableCell>
						<TableCell>
							<Text fontSize="10">{blocked.lastName}</Text>
						</TableCell>
						<TableCell>
							<EndpointButton
								useSmall={true}
								endpointRef={setEndpoints}
								toSet={{ endpoint: `/blocked/remove/${blocked.id}`, data: {} }}
							>
								<Text>Remove</Text>
							</EndpointButton>
						</TableCell>
					</TableRow>
				);
			},
		);

		return (
			<>
				<h1>Settings</h1>

				<Item>
					<Label>
						{" "}
						<Text fontSize="20px">Username</Text>
					</Label>
					<TextInput
						type="text"
						placeholder={user.userName}
						onChange={(e) => {
							handleUserName(e.target.value);
						}}
					/>
					{UserNameValid ? (
						<Text>username available and unique</Text>
					) : (
						<Text>username already in use</Text>
					)}
				</Item>
				<Item>
					<Label>
						{" "}
						<Text fontSize="20px">FirstName</Text>
					</Label>
					<TextInput
						type="text"
						placeholder={user.firstName}
						onChange={(e) => {
							user.firstName = e.target.value;
						}}
					/>
				</Item>
				<Item>
					<Label>
						{" "}
						<Text fontSize="20px">Lastname</Text>
					</Label>
					<TextInput
						type="text"
						placeholder={user.lastName}
						onChange={(e) => {
							user.lastName = e.target.value;
						}}
					/>
				</Item>
				<Item>
					<Label htmlFor="upload-button">
						{!image ? (
							<div>
								<ImgContainer>
									<Img
										src={"http://localhost:5000/" + user.avatar}
										alt="profileImg"
										width="300"
										height="300"
									/>
								</ImgContainer>
								<Text>Click here to upload a new avatar</Text>
							</div>
						) : (
							<ImgContainer>
								<Img src={image} alt="dummy" width="300" height="300" />
							</ImgContainer>
						)}
					</Label>
					<input
						type="file"
						id="upload-button"
						style={{ display: "none" }}
						onChange={handleFileUpload}
					/>
				</Item>
				<Label>
					{" "}
					<Text fontSize="20px">Blocked users</Text>
				</Label>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHeaderCell>Username</TableHeaderCell>
							<TableHeaderCell>First Name</TableHeaderCell>
							<TableHeaderCell>Last Name</TableHeaderCell>
							<TableHeaderCell>Edit</TableHeaderCell>
						</TableRow>
					</TableHeader>
					<tbody>
						{listblockedusers && listblockedusers.length
							? listblockedusers
							: null}
					</tbody>
				</Table>
				<Text>Search for users to block</Text>
				<AddUserInput
					placeholder="Type to search..."
					onValidUser={(e: User) => setBlockedToAdd([...blockedToAdd, e])}
				></AddUserInput>
				{blockedToAdd.length
					? displayToAdd(blockedToAdd, "Blocked staged to add")
					: ""}
				<Label>
					{" "}
					<Text fontSize="20px">Friends</Text>
				</Label>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHeaderCell>Username</TableHeaderCell>
							<TableHeaderCell>First Name</TableHeaderCell>
							<TableHeaderCell>Last Name</TableHeaderCell>
							<TableHeaderCell>Edit</TableHeaderCell>
						</TableRow>
					</TableHeader>
					<tbody>
						{user.friends && user.friends.length ? listfriends : null}
					</tbody>
				</Table>
				<Item>
					<Text>Search for friends to add</Text>
				</Item>
				<AddUserInput
					placeholder="Type to search..."
					onValidUser={(e: User) => setFriendsToAdd([...friendsToAdd, e])}
				/>
				{friendsToAdd.length
					? displayToAdd(friendsToAdd, "Friends staged to add")
					: ""}
				<Item>
					<Label>
						{" "}
						<Text fontSize="20px">Two Factor Authentication</Text>
					</Label>
					<input type="checkbox" checked={isChecked} onChange={twoFAChange} />
				</Item>

				{isChecked && !initial2FAEnabled ? (
					<Item>
						{qrcode !== undefined && qrcode.qrcode !== undefined ? (
							<img src={qrcode.qrcode} alt="" />
						) : (
							"loading"
						)}
						<Label>
							<Text fontSize="20px">Input2FA code pls</Text>
						</Label>
						<TextInput
							type="text"
							onChange={(e) => {
								setinputtedTwoFA(e.target.value);
							}}
						/>
					</Item>
				) : !isChecked && initial2FAEnabled ? (
					<Item>
						<Label>
							<Text fontSize="20px">Your 2fa code please</Text>
						</Label>
						<TextInput
							type="text"
							onChange={(e) => {
								setinputtedTwoFA(e.target.value);
							}}
						/>
					</Item>
				) : (
					""
				)}
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
