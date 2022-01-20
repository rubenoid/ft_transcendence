import React, { useEffect } from "react";
import { useState } from "react";
import { FormContainer, Form, Label, Button } from "./ConnectionFormElements";
import { useNavigate } from "react-router-dom";
import { SharedHeroSection } from "../HeroSection/HeroSection";
import { postData, fetchData } from "../../API/API";
import QRCode from "qrcode.react";
import { Text } from "../Utils/Text/Text";
import { TextInput } from "../Utils/TextInput/TextInput";
import { Item } from "../Utils/List/List";
import { RoundButton } from "../Utils/Buttons/Round/RoundButton";
import { User } from "../../Types/Types";

const RegistrationForm = (): JSX.Element => {
	const [userNameValid, setUserNameValid] = useState<boolean>(true);
	const [registered, setRegistered] = useState<boolean>(false);

	const [twoFAEnabled, setTwoFAEnabled] = useState<boolean>(false);
	const [firstName, setFirstName] = useState<string>("");
	const [lastName, setLastName] = useState<string>("");
	const [userName, setUserName] = useState<string>("");

	const [qrcode, setqrcode] = useState<string>(undefined);
	const [inputtedTwoFA, setinputtedTwoFA] = useState<string>(undefined);
	const navigate = useNavigate();
	const { isConnected, setIsConnected } = SharedHeroSection();

	useEffect(() => {
		async function getUsers(): Promise<void> {
			const endpoint = `/user/getByUserName/${userName}`;
			const user: User = await fetchData(endpoint);
			user ? setUserNameValid(false) : setUserNameValid(true);
		}
		getUsers();
	}, [userName]);

	useEffect(() => {
		async function getQR(): Promise<string> {
			if (!registered || !twoFAEnabled) {
				return;
			}
			const qrcodegot: string = await fetchData("auth/getQr");
			setqrcode(qrcodegot);
			return qrcode;
		}
		getQR();
	}, [registered]);

	const handleChangetwoFA = (
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
	): void => {
		e.preventDefault();
		setTwoFAEnabled(!twoFAEnabled);
	};

	const registerNewUser = (
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
	): void => {
		e.preventDefault();
		if (userName && firstName && lastName && userNameValid) {
			if (!twoFAEnabled) {
				postData("/auth/register", { userName, firstName, lastName });
				fetchData("/auth/logedin").then(() => {
					setIsConnected(true);
					navigate("/", { replace: true });
				});
			} else setRegistered(true);
		} else {
			console.log("Error->", userName, firstName, lastName, twoFAEnabled);
		}
	};

	useEffect(() => {
		async function inputAccessCode(): Promise<boolean> {
			if (inputtedTwoFA && inputtedTwoFA.length != 6) return;
			const validated: boolean = await postData(`/auth/inputAccessCode`, {
				usertoken: inputtedTwoFA,
			});
			if (validated == true) {
				console.log("twoFAtrue");
				await postData("/auth/register", { userName, firstName, lastName });
				fetchData("/auth/logedin").then(() => {
					setIsConnected(true);
					navigate("/", { replace: true });
				});
			}
			return validated;
		}
		inputAccessCode();
	}, [inputtedTwoFA]);

	return (
		<FormContainer>
			<Form>
				{!registered ? (
					<>
						<Item>
							<Item>
								<RoundButton>
									<Text fontSize="20px">42</Text>
								</RoundButton>
							</Item>
							<Item>
								<Label>
									<Text fontSize="20px">Username</Text>
								</Label>
								<TextInput
									type="text"
									onChange={(e) => {
										setUserName(e.target.value);
									}}
								/>
								{!userNameValid ? <Text>username already in use</Text> : ""}
							</Item>
							<Item>
								<Label>
									<Text fontSize="20px">FirstName</Text>
								</Label>
								<TextInput
									type="text"
									onChange={(e) => {
										setFirstName(e.target.value);
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
										setLastName(e.target.value);
									}}
								/>
							</Item>
						</Item>
						<Text>Enable Two factor Authenication</Text>
						<Button
							type="submit"
							onClick={(e) => {
								handleChangetwoFA(e);
							}}
						>
							{twoFAEnabled ? (
								<Text fontSize="20px">Disable</Text>
							) : (
								<Text fontSize="20px">Enable</Text>
							)}
						</Button>
						<Item>
							<Button
								type="submit"
								onClick={(e) => {
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
				{registered && twoFAEnabled ? (
					<Item>
						<img src={qrcode} alt="" />
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
				) : (
					""
				)}
			</Form>
		</FormContainer>
	);
};

export default RegistrationForm;
