import React, { useEffect, useState } from "react";
import {
	TextInput,
	Text,
	WidgetContainer,
	Button,
	TableRow,
	TableCell,
	TableHeader,
	TableHeaderCell,
	Table,
	TextContainer,
} from "../Utils/Utils";
import { RoundButton, Item } from "../Utils/Utils";
import { fetchData, postData, User } from "../../API/API";
import { SettingsContainer, UsersContainer } from "./SettingsElements";
import { Label } from "../ConnectionForm/ConnectionFormElements";
import { Img, ImgContainer } from "../Profile/ProfileElements";
import { SearchResultContainer } from "../AddFriend/AddFriendElements";
import { Link, useNavigate } from "react-router-dom";

interface HTMLInputEvent extends HTMLInputElement {
	target: HTMLInputElement & EventTarget;
}

interface detailedUser extends User {
	twoFactorSecret: string;
	blockedUsers: number[];
	blockedUsersAsUsers: detailedUser[];
	initial2FAEnabled: boolean;
}

const SettingsForm = (): JSX.Element => {
	const navigate = useNavigate();
	const [user, setUser] = useState<detailedUser>(undefined);

	const [image, setImage] = useState<string>("");
	const [file, setfile] = useState(undefined);

	const [isChecked, setIsChecked] = useState(undefined);
	const [qrcode, setqrcode] = useState<string>(undefined);
	const [inputtedTwoFA, setinputtedTwoFA] = useState<string>(undefined);
	const [twoFAvalid, settwoFAvalid] = useState<boolean>(undefined);

	const [UserNameValid, setUserNameValid] = useState<boolean>(undefined);
	const [user2friend, setuser2friend] = useState<detailedUser>();
	const [user2block, setuser2block] = useState<detailedUser>();

	useEffect(() => {
		async function getUser(): Promise<User> {
			const user: detailedUser = await fetchData("/user/meAndFriends");
			if (user.twoFactorSecret.length == 0) {
				setIsChecked(false);
				user.initial2FAEnabled = false;
			} else {
				setIsChecked(true);
				user.initial2FAEnabled = true;
			}
			user.blockedUsersAsUsers = [];
			for (const blockeduser of user.blockedUsers) {
				const endpoint = `/user/get/${blockeduser}`;
				user.blockedUsersAsUsers.push(await fetchData(endpoint));
			}
			setUser(user);
			return user;
		}
		getUser();
	}, []);

	const uploadDataForm = async () => {
		const formData = new FormData();
		formData.append("user", JSON.stringify(user));
		formData.append("file", file);
		await postData("/user/updateForm", formData, {
			"Content-Type": "multipart/form-data",
		});
		navigate("/", { replace: false });
	};

	/* username valid */
	const handleUserName = (e: string) => {
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
	useEffect(() => {
		async function getQR(): Promise<string> {
			if (isChecked && !user.initial2FAEnabled) {
				const endpoint = `auth/getQr`;
				const qrcodegot: string = await fetchData(endpoint);
				setqrcode(qrcodegot);
				console.log("QRCODE:", qrcode);
				return qrcode;
			}
		}
		getQR();
	}, [isChecked]);

	const twoFAChange = () => {
		setIsChecked(!isChecked);
		if (!isChecked) setinputtedTwoFA(undefined);
	};

	useEffect(() => {
		async function inputAccessCode(): Promise<void> {
			if (inputtedTwoFA && inputtedTwoFA.length != 6) return;
			const endpoint = `/auth/inputAccessCode`;
			const validated: boolean = await postData(endpoint, {
				usertoken: inputtedTwoFA,
			});
			if (validated == true) {
				settwoFAvalid(true);
				if (user && user.initial2FAEnabled == true) {
					const endpoint = `user/removeTwoFA`;
					const qrcodegot: string = await fetchData(endpoint);
				}
			}
		}
		inputAccessCode();
	}, [inputtedTwoFA]);

	/* upload avatar */
	const handleFileUpload = (e: React.ChangeEvent<HTMLInputEvent>) => {
		if (e.target.files.length) {
			setImage(URL.createObjectURL(e.target.files[0]));
		}
		setfile(e.target.files[0]);
	};

	/* blocked and friends editing */
	const handleChangeSearch = (e: string, whatToChange: string) => {
		async function getUser4Change(): Promise<User> {
			const endpoint = `/user/getByUserName/${e}`;
			const user: detailedUser = await fetchData(endpoint);
			if (user && whatToChange == "friends") {
				setuser2friend(user);
			}
			if (user && whatToChange == "blocked") {
				setuser2block(user);
			}
			return user;
		}
		getUser4Change();
	};

	const settingsData = () => {
		const addChange = async (id: number, whatToChange: string) => {
			const endpoint = `/${whatToChange}/add/${id}`;
			await fetchData(endpoint);
		};

		const removeChange = async (id: number, whatToChange: string) => {
			const endpoint = `/${whatToChange}/remove/${id}`;
			await fetchData(endpoint);
		};

		const SearchResult = (user2add: detailedUser, whatToChange: string) => {
			return (
				<SearchResultContainer>
					<Text>{user2add.userName}</Text>
					<Button
						onClick={() => {
							addChange(user2add.id, whatToChange);
						}}
					>
						Add
					</Button>
				</SearchResultContainer>
			);
		};

		const friendz = user.friends;
		const blocked = user.blockedUsersAsUsers;

		const listfriends = friendz.map((friendz, key: number) => {
			return (
				<TableRow key={key}>
					<TableCell>
						<Text fontSize="10">{friendz.userName}</Text>
					</TableCell>
					<TableCell>
						<Text fontSize="10">{friendz.firstName}</Text>
					</TableCell>
					<TableCell>
						<Text fontSize="10">{friendz.lastName}</Text>
					</TableCell>
					<TableCell>
						<Button
							onClick={(e) => {
								removeChange(friendz.id, "friends");
							}}
						>
							<Text>Remove</Text>
						</Button>
					</TableCell>
				</TableRow>
			);
		});

		const listblockedusers = blocked.map((blocked, key: number) => {
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
						<Button
							onClick={(e) => {
								removeChange(blocked.id, "blocked");
							}}
						>
							<Text>Remove</Text>
						</Button>
					</TableCell>
				</TableRow>
			);
		});

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
							setUser({ ...user, firstName: e.target.value });
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
							setUser({ ...user, lastName: e.target.value });
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
				<Item>
					<Label>
						{" "}
						<Text fontSize="20px">Blocked users</Text>
					</Label>
					<Table>
						{listblockedusers.length ? (
							<TableHeader>
								<TableRow>
									<TableHeaderCell>Username</TableHeaderCell>
									<TableHeaderCell>First Name</TableHeaderCell>
									<TableHeaderCell>Last Name</TableHeaderCell>
									<TableHeaderCell>Edit</TableHeaderCell>
								</TableRow>
							</TableHeader>
						) : (
							""
						)}
						<tbody>
							{listblockedusers.length ? (
								listblockedusers
							) : (
								<Item>No blocked users</Item>
							)}
						</tbody>
					</Table>
				</Item>
				<TextContainer>
					<Text>Search for users to block</Text>
				</TextContainer>
				<TextInput
					type="text"
					placeholder="Type to search..."
					onChange={(e) => handleChangeSearch(e.target.value, "blocked")}
				></TextInput>
				{user2block ? SearchResult(user2block, "blocked") : ""}
				<Item>
					<Label>
						{" "}
						<Text fontSize="20px">Two Factor Authentication</Text>
					</Label>
					<input type="checkbox" checked={isChecked} onChange={twoFAChange} />
					{isChecked && !user.initial2FAEnabled ? (
						<Item>
							<img src={qrcode} alt="" />
							<a href="http://localhost:5000/auth/getQr" download="QRCode"></a>
							<Label>
								{" "}
								<Text fontSize="20px">Input2FA code pls</Text>
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
					{!isChecked && user.initial2FAEnabled ? (
						<Item>
							<Label>
								{" "}
								<Text fontSize="20px">Input2FA code pls</Text>
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
				</Item>
				<Item>
					<Label>
						{" "}
						<Text fontSize="20px">Friends</Text>
					</Label>
					<Table>
						{user.friends.length ? (
							<TableHeader>
								<TableRow>
									<TableHeaderCell>Username</TableHeaderCell>
									<TableHeaderCell>First Name</TableHeaderCell>
									<TableHeaderCell>Last Name</TableHeaderCell>
									<TableHeaderCell>Edit</TableHeaderCell>
								</TableRow>
							</TableHeader>
						) : (
							""
						)}
						<tbody>
							{user.friends.length ? listfriends : <Item>No friends</Item>}
						</tbody>
					</Table>
					<TextContainer>
						<Text>Search for friends to add</Text>
					</TextContainer>
					<TextInput
						type="text"
						placeholder="Type to search..."
						onChange={(e) => handleChangeSearch(e.target.value, "friends")}
					></TextInput>
					{user2friend ? SearchResult(user2friend, "friends") : ""}
				</Item>
				{UserNameValid == false ||
				(isChecked && !twoFAvalid && !user.initial2FAEnabled) ||
				(!isChecked && !twoFAvalid && user.initial2FAEnabled) ? (
					""
				) : (
					<Button onClick={uploadDataForm}>
						<Text fontSize="15px">Save changes</Text>
					</Button>
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
