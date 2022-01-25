import React, { useEffect } from "react";
import { useState } from "react";
import { FormContainer, Form, Label, Button } from "./ConnectionFormElements";
import { useNavigate } from "react-router-dom";
import { SharedConnectionStatus } from "../../App/ConnectionStatus";
import { postData, fetchData } from "../../API/API";
import { Text } from "../Utils/Text/Text";
import { TextInput } from "../Utils/TextInput/TextInput";
import { Item } from "../Utils/List/List";
import { User } from "../../Types/Types";

class RegistrationItems {
	firstName = "";
	lastName = "";
	userName = "";
	userNameValid = false;
	twoFAEnabled = false;
	twoFAValid = false;
	inputtedTwoFA = "";
}

interface QrData {
	qrcode: string;
	secret: string;
}

const RegistrationForm = (): JSX.Element => {
	const navigate = useNavigate();
	const [registration, setRegistration] = useState<RegistrationItems>(
		new RegistrationItems(),
	);
	const [qrcode, setQrcode] = useState<QrData>(undefined);
	const { isConnected, setIsConnected } = SharedConnectionStatus();

	useEffect(() => {
		async function getUsers(): Promise<void> {
			if (registration.userName == "") return;
			const user: User = await fetchData(
				`/user/getByUserName/${registration.userName}`,
			);
			user
				? setRegistration((prevState) => ({
						...prevState,
						userNameValid: false,
				  }))
				: setRegistration((prevState) => ({
						...prevState,
						userNameValid: true,
				  }));
		}
		getUsers();
	}, [registration.userName]);

	useEffect(() => {
		if (registration.twoFAEnabled == true) return;
		fetchData("auth/getQrRetSecret").then((data: QrData) => {
			console.log("DATA", data.qrcode);
			setQrcode(data);
		});
	}, [registration.twoFAEnabled]);

	const registerNewUser = async (
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
	): Promise<void> => {
		e.preventDefault();
		console.log("REG->", registration);
		if (
			registration.userName &&
			registration.firstName &&
			registration.lastName &&
			(registration.twoFAEnabled == false || registration.twoFAValid) &&
			registration.userNameValid
		) {
			await postData("/auth/register", {
				userName: registration.userName,
				firstName: registration.firstName,
				lastName: registration.lastName,
				twoFASecret:
					registration.twoFAValid && qrcode && qrcode.secret
						? qrcode.secret
						: "",
			});
			setIsConnected(true);
			await fetchData("/auth/logedin");
			if (registration.twoFAValid) navigate("/checkTwoFA", { replace: true });
			else navigate("/", { replace: true });
		}
	};

	useEffect(() => {
		async function inputAccessCode(): Promise<void> {
			if (
				registration.inputtedTwoFA == "" ||
				registration.inputtedTwoFA.length != 6
			)
				return;
			console.log("this in in input access");
			const validated: boolean = await postData(`/auth/testQrCode`, {
				usertoken: registration.inputtedTwoFA,
				secret: qrcode.secret,
			});
			setRegistration((prevState) => ({
				...prevState,
				twoFAValid: validated,
			}));
		}
		inputAccessCode();
	}, [registration.inputtedTwoFA]);

	return (
		<FormContainer>
			<Form>
				<Item>
					<Label>
						<Text fontSize="20px">Username</Text>
					</Label>
					<TextInput
						type="text"
						onChange={(e) => {
							setRegistration((prevState) => ({
								...prevState,
								userName: e.target.value,
							}));
						}}
					/>
					{!registration.userNameValid ? (
						<Text>username is not valid</Text>
					) : (
						""
					)}
				</Item>
				<Item>
					<Label>
						<Text fontSize="20px">FirstName</Text>
					</Label>
					<TextInput
						type="text"
						onChange={(e) => {
							setRegistration((prevState) => ({
								...prevState,
								firstName: e.target.value,
							}));
						}}
					/>
				</Item>
				<Item>
					<Label>
						<Text fontSize="20px">Lastname</Text>
					</Label>
					<TextInput
						type="text"
						onChange={(e) => {
							setRegistration((prevState) => ({
								...prevState,
								lastName: e.target.value,
							}));
						}}
					/>
				</Item>
				<Text>Enable Two factor Authenication</Text>
				<Button
					onClick={(e) => {
						e.preventDefault();
						setRegistration((prevState) => ({
							...prevState,
							twoFAEnabled: !registration.twoFAEnabled,
						}));
					}}
				>
					{registration.twoFAEnabled ? (
						<Text fontSize="20px">Disable</Text>
					) : (
						<Text fontSize="20px">Enable</Text>
					)}
				</Button>
				{registration.twoFAEnabled ? (
					<Item>
						<img src={qrcode.qrcode} alt="" />
						<Label>
							<Text fontSize="20px">Input2FA code pls</Text>
						</Label>
						<TextInput
							type="text"
							onChange={(e) => {
								setRegistration((prevState) => ({
									...prevState,
									inputtedTwoFA: e.target.value,
								}));
							}}
						/>
					</Item>
				) : (
					""
				)}
				<Item>
					<Button
						onClick={(e) => {
							e.preventDefault();
							registerNewUser(e);
						}}
					>
						<Text fontSize="20px">Register</Text>
					</Button>
				</Item>
			</Form>
		</FormContainer>
	);
};

export default RegistrationForm;
