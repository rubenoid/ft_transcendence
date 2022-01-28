import React, { useEffect } from "react";
import { useState } from "react";
import { FormContainer, Form, Label, Button } from "./ConnectionFormElements";
import { useNavigate } from "react-router-dom";
import { SharedConnectionStatus } from "../../App/ConnectionStatus";
import { postData, fetchData } from "../../API/API";
import QRCode from "qrcode.react";
import { Text } from "../Utils/Text/Text";
import { TextInput } from "../Utils/TextInput/TextInput";
import { Item } from "../Utils/List/List";
import { RoundButton } from "../Utils/Buttons/Round/RoundButton";
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
	const [registered, setRegistered] = useState<boolean>(false);
	const navigate = useNavigate();

	const [registration, setRegistration] = useState<RegistrationItems>(
		new RegistrationItems(),
	);

	const [qrcode, setQrcode] = useState<QrData>(undefined);
	const { isConnected, setIsConnected } = SharedConnectionStatus();

	useEffect(() => {
		async function getUsers(): Promise<void> {
			const user: User = await fetchData(
				`/user/getByUserName/${registration.userName}`,
			);
			user
				? setRegistration({ ...registration, userNameValid: false })
				: setRegistration({ ...registration, userNameValid: true });
		}
		getUsers();
	}, [registration.userName]);

	useEffect(() => {
		if (registration.twoFAEnabled == true) return;
		fetchData("auth/getQrRetSecret")
			.then((data: QrData) => {
				console.log("DATA", data.qrcode);
				setQrcode(data);
			})
			.catch((err) => {
				console.log("ERRORORORORO", err);
			});
	}, [registration.twoFAEnabled]);

	const registerNewUser = (
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
	): void => {
		e.preventDefault();
		if (
			registration.userName &&
			registration.firstName &&
			registration.lastName &&
			(registration.twoFAEnabled == false || registration.twoFAValid) &&
			registration.userNameValid
		) {
			postData("/auth/register", {
				userName: registration.userName,
				firstName: registration.firstName,
				lastName: registration.lastName,
			});
			fetchData("/auth/logedin").then(() => {
				setIsConnected(true);
				navigate("/", { replace: true });
			});
		} else {
			console.log("Error->", registration);
		}
	};

	useEffect(() => {
		async function inputAccessCode(): Promise<void> {
			if (registration.inputtedTwoFA && registration.inputtedTwoFA.length != 6)
				return;
			const validated: boolean = await postData(`/auth/check2faInput`, {
				usertoken: registration.inputtedTwoFA,
				secret: qrcode.secret,
			});
			setRegistration({ ...registration, twoFAValid: validated });
		}
		inputAccessCode();
	}, [registration.inputtedTwoFA]);

	return (
		<FormContainer>
			<Form>
				{!registered ? (
					<>
						<Item>
							<Label>
								<Text fontSize="20px">Username</Text>
							</Label>
							<TextInput
								type="text"
								onChange={(e) => {
									setRegistration({
										...registration,
										userName: e.target.value,
									});
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
									setRegistration({
										...registration,
										firstName: e.target.value,
									});
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
									setRegistration({
										...registration,
										lastName: e.target.value,
									});
								}}
							/>
						</Item>
						<Text>Enable Two factor Authenication</Text>
						<Button
							onClick={(e) => {
								e.preventDefault();
								setRegistration({
									...registration,
									twoFAEnabled: !registration.twoFAEnabled,
								});
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
										setRegistration({
											...registration,
											inputtedTwoFA: e.target.value,
										});
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
					</>
				) : (
					" "
				)}
			</Form>
		</FormContainer>
	);
};

export default RegistrationForm;
